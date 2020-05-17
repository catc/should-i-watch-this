import * as d3 from 'd3'
import { ChartValues, getXY } from './utils'
import { Episode } from '../../utils/types'
import { SvgSelection, PADDING, DivSelection, D3Selection } from './constants'
import { bisector } from 'd3'

export type UpdateTooltipFn = (e: Episode | null) => void

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
	updateTooltip: UpdateTooltipFn,
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
				updateTooltip(episode)
				// updateTooltip(episode, episode ? getx(episode) : 0)
				// line.update(episode ? getx(episode) : undefined)
			})
			.on('mouseout', () => {
				updateTooltip(null)
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
