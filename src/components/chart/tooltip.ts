import * as d3 from 'd3'
import { ChartValues, getXY } from './utils'
import { Episode } from '../../utils/types'
import { SvgSelection, PADDING, DivSelection, D3Selection } from './constants'
import { bisector } from 'd3'

function _createTooltip(content: D3Selection) {
	const tooltip = content.append('g').attr('class', 'tooltip')

	const width = 150

	// const rect = tooltip
	// 	.append('rect')
	// 	.style('fill', 'white')
	// 	.attr('x', 0)
	// 	.attr('y', 0)
	// 	.attr('width', width)
	// 	.attr('height', 100)
	const info = tooltip.append('text')
	const rating = tooltip.append('text').attr('y', '22')
	// const x = tooltip.append('text').attr('y', '44')

	tooltip
		.append('line')
		.attr('y1', 0)
		.attr('y2', -400)
		.attr('x1', 0)
		.attr('x2', 0)
		.attr('stroke', 'black')
	const padding = 80

	const y = 300
	const x = 200

	// return (episode: Episode | null, episodex?: number, mousex?: number) => {
	return (episode: Episode | null, x) => {
		if (!episode) {
			tooltip.style('opacity', 0)
		} else {
			// tooltip.style('opacity', 1).attr('transform', `translate(${episodex},${300})`)
			// info.text(`${episode.Season} : ${episode.Episode}`)
			// x.text(`${episodex?.toFixed(0)} : ${mousex?.toFixed(0)}`)
			tooltip.style('opacity', 1).attr('transform', `translate(${x},${y})`)
			info.text(`${episode.season} : ${episode.episode}`)
			// x.text(`${episodex?.toFixed(0)} : ${mousex?.toFixed(0)}`)
			rating.text(episode.rating)
			// rating.text(episode.Title)
			// .call(wrap, width)
		}
	}
}
/*
	LEFT OFF HERE
	- DONE fix issue with community -> got
	- DONE incorporate new data source to see if it solves bad data issues
		- eg brooklyn 99
	- consider placing tooltip right under title?

	TITLE
	S01 E12, 4.2/10

	- DONE see if can use getx instead of custom function below
	- consider adding zoom again and just removing scroll?
*/

function createLine(content: D3Selection) {
	const line = content
		.append('line')
		.attr('y1', 0)
		.attr('y2', 500)
		.attr('x1', 0)
		.attr('x2', 0)
		.attr('stroke', '#ddd')

	return {
		update(x?: number) {
			if (x) {
				line.attr('x1', x).attr('x2', x).style('opacity', 1)
			} else {
				line.style('opacity', 0)
			}
		},
	}
}

export function createTooltip(
	content: D3Selection,
	chartHeight: number,
	xScale: any,
	updateTooltip: any,
) {
	const overlay = content
		.append('rect')
		.attr('id', 'tooltip-overlay')
		.attr('x', 0)
		.attr('y', 0)
		.attr('height', chartHeight)

	// const line = createLine(content)
	// const tooltip = _createTooltip(content)

	function update(values: ChartValues, episodes: Episode[]) {
		const { TOTAL_WIDTH, RANGES_NORMALIZED, SIZE, VERTICAL_LINE_ADJUST } = values
		const { getx } = getXY(xScale, null, values.SIZE)

		// update width
		overlay.attr('width', TOTAL_WIDTH)

		// create bisector
		const bisect = d3.bisector((episode: Episode, x: number) => {
			// - VERTICAL_LINE_ADJUST + values.SIZE to account for bisector left
			const episodex = getx(episode) - VERTICAL_LINE_ADJUST + values.SIZE
			return episodex - x
		}).left

		// add listeners
		overlay
			.on('mousemove', function mousemove(e) {
				// get mouse x
				const m = d3.mouse(this)
				const x = m[0]

				// find episode
				const i = bisect(episodes, x)
				const episode = episodes[i] || null

				// update
				updateTooltip(episode, episode ? getx(episode) : 0)
				// line.update(episode ? getx(episode) : undefined)
			})
			.on('mouseout', () => {
				// updateTooltip(null)
			})
	}

	return {
		disable() {
			updateTooltip(null)
			overlay.on('mousemove', null).on('mouseout', null)
		},
		update,
	}
}
