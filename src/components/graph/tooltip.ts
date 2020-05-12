import * as d3 from 'd3'
import { ChartValues } from './utils'
import { Episode } from '../../utils/types'
import { SvgSelection, PADDING, DivSelection } from './constants'
import { bisector } from 'd3'

function templateContent(t: DivSelection, episode: Episode) {
	// t.html(
	// 	`
	// 	${episode.Season} : ${episode.Episode}
	// 	<br/>
	// 	${episode.imdbRating}
	// `,
	// )
}

function _createTooltip(content: SvgSelection) {
	// const info = `<text></text>`
	// const rating = `<text></text>`
	// const template = content

	const tooltip = content.append('g').attr('class', 'tooltip')

	const info = tooltip.append('text')
	const rating = tooltip.append('text').attr('y', '22')

	tooltip
		.append('line')
		.attr('y1', 0)
		.attr('y2', -400)
		.attr('x1', 0)
		.attr('x2', 0)
		.attr('stroke', 'black')

	// tooltip.html(`${info}${rating}`)
	// .append('div').attr('class', 'tooltip')
	// .html()

	return (episode: Episode | null, x?: number) => {
		if (!episode) {
			tooltip.style('opacity', 0)
		} else {
			// templateContent(tooltip, episode)
			tooltip.style('opacity', 1).attr('transform', `translate(${x},${300})`)
			// .attr('y', 400).attr('x', x)
			// info.textContent
			info.text(`${episode.Season} : ${episode.Episode}`)
			rating.text(episode.imdbRating)
		}
	}
}

export function createTooltip(
	content: SvgSelection,
	chartHeight: number,
	values: ChartValues,
	episodes: Episode[],
	// tooltip: any,
) {
	const rect = content
		.append('rect')
		.attr('id', 'tooltip-rect')
		.attr('x', 0)
		.attr('y', 0)
		.attr('height', chartHeight)

	const tooltip = _createTooltip(content)

	function update(values: ChartValues, episodes: Episode[]) {
		const { TOTAL_WIDTH, RANGES_NORMALIZED, SIZE, VERTICAL_LINE_ADJUST } = values

		// update width
		rect.attr('width', TOTAL_WIDTH)

		// xScale(String(episode.Season)) + (episode.Episode - 1) * size
		function getEpisodeX(episode: Episode) {
			return (
				RANGES_NORMALIZED[episode.Season - 1] +
				(episode.Episode - 1) * SIZE +
				PADDING -
				SIZE
			)
		}

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
		rect.on('mouseout', () => {
			// tooltip(null)
		}).on('mousemove', function mousemove() {
			const m = d3.mouse(this)
			const x = m[0]

			const i = bisect(episodes, x)
			const episode = episodes[i]
			tooltip(episode, getEpisodeX(episode))
		})
	}

	update(values, episodes)

	return {
		update,
	}
}
