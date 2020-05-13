import * as d3 from 'd3'
import { ChartValues, GetXYReturn } from './utils'
import { Episode } from '../../utils/types'
import { SvgSelection, PADDING, DivSelection, D3Selection } from './constants'
import { bisector } from 'd3'

// TODO- remove, unused
function templateContent(t: DivSelection, episode: Episode) {
	// t.html(
	// 	`
	// 	${episode.Season} : ${episode.Episode}
	// 	<br/>
	// 	${episode.imdbRating}
	// `,
	// )
}

function _createTooltip(content: D3Selection) {
	const tooltip = content.append('g').attr('class', 'tooltip')

	const info = tooltip.append('text')
	const rating = tooltip.append('text').attr('y', '22')
	const x = tooltip.append('text').attr('y', '44')

	tooltip
		.append('line')
		.attr('y1', 0)
		.attr('y2', -400)
		.attr('x1', 0)
		.attr('x2', 0)
		.attr('stroke', 'black')

	return (episode: Episode | null, episodex?: number, mousex?: number) => {
		if (!episode) {
			tooltip.style('opacity', 0)
		} else {
			tooltip.style('opacity', 1).attr('transform', `translate(${episodex},${300})`)
			info.text(`${episode.Season} : ${episode.Episode}`)
			// rating.text(episode.imdbRating)
			x.text(`${episodex?.toFixed(0)} : ${mousex?.toFixed(0)}`)
		}
	}
}

export function createTooltip(content: D3Selection, chartHeight: number) {
	const rect = content
		.append('rect')
		.attr('id', 'tooltip-overlay')
		.attr('x', 0)
		.attr('y', 0)
		.attr('height', chartHeight)

	const tooltip = _createTooltip(content)

	function update(values: ChartValues, episodes: Episode[], getx: GetXYReturn['getx']) {
		const { TOTAL_WIDTH, RANGES_NORMALIZED, SIZE, VERTICAL_LINE_ADJUST } = values

		// update width
		rect.attr('width', TOTAL_WIDTH)

		// create bisector
		const bisect = d3.bisector((episode: Episode, x: number) => {
			const episodex =
				RANGES_NORMALIZED[episode.Season - 1] +
				(episode.Episode - 1) * SIZE +
				PADDING -
				VERTICAL_LINE_ADJUST

			// console.log(`${episode.Season} :: ${episode.Episode}`, '::', episodex.toFixed(1), x)
			return episodex - x
		}).left

		// add listeners
		rect.on('mousemove', function mousemove(e) {
			// get mouse x
			const m = d3.mouse(this)
			const x = m[0]

			// find episode
			const i = bisect(episodes, x)
			const episode = episodes[i]

			if (!episode) return
			// update tooltip
			tooltip(episode, getx(episode), x)
		}).on('mouseout', () => {
			tooltip(null)
		})
	}

	return {
		disable() {
			tooltip(null)
			rect.on('mousemove', null).on('mouseout', null)
		},
		update,
	}
}
