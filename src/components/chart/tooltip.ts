import * as d3 from 'd3'
import { ChartValues, getXY } from './utils'
import { Episode } from '../../utils/types'
import { D3Selection } from './constants'

export type UpdateTooltipFn = (e: Episode | null) => void

function createUpdateBisectorLine(
	line: d3.Selection<SVGLineElement, unknown, null, undefined>,
	chartHeight: number,
) {
	line.attr('y1', 0).attr('y1', chartHeight).style('opacity', 0)

	return function update(x: number | null) {
		if (x) {
			line.attr('x1', x).attr('x2', x).style('opacity', 1)
		} else {
			line.style('opacity', 0)
		}
	}
}

export function createTooltip(
	content: D3Selection,
	chartHeight: number,
	xScale: any,
	updateTooltip: UpdateTooltipFn,
	bisectorLine: d3.Selection<SVGLineElement, unknown, null, undefined>,
) {
	const overlay = content
		.append('rect')
		.attr('id', 'tooltip-overlay')
		.attr('x', 0)
		.attr('y', 0)
		.attr('height', chartHeight)

	const updateBisectorLine = createUpdateBisectorLine(bisectorLine, chartHeight)

	let showBisector = false

	function update(values: ChartValues, episodes: Episode[]) {
		const { TOTAL_WIDTH, VERTICAL_LINE_ADJUST } = values
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
				showBisector && episode
					? updateBisectorLine(getx(episode))
					: updateBisectorLine(null)
			})
			.on('mouseout', () => {
				updateTooltip(null)
				updateBisectorLine(null)
			})
	}

	return {
		disable() {
			updateTooltip(null)
			overlay.on('mousemove', null).on('mouseout', null)
		},
		update,

		toggleBisectorLine() {
			showBisector = !showBisector
			updateBisectorLine(null)
			return showBisector
		},
	}
}
