import * as d3 from 'd3'
import { parseSvg } from 'd3-interpolate/src/transform/parse'
import { CONTENT_ID } from './constants'

/*
	TODO - add scroll panning
*/

export default class Pan {
	svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
	chartWidth: number
	drag?: d3.DragBehavior<Element, unknown, unknown>

	constructor(svg: any, chartWidth: number) {
		this.svg = svg
		this.chartWidth = chartWidth

		this._setupDrag()
	}

	_setupDrag() {
		const svg = this.svg
		const content = svg.select(CONTENT_ID)
		const svgWidth = parseInt(svg.attr('width'), 10)
		const contentWidth = (content.node() as SVGElement).getBoundingClientRect().width

		let pointerStart = 0
		let initalContentX = 0

		this.drag = d3
			.drag()
			.on('start', dragstarted)
			.on('drag', dragged)
			.on('end', dragended)

		this.svg.call(this.drag)

		function dragstarted() {
			svg.attr('cursor', 'grabbing')
			d3.select(this).raise()

			pointerStart = d3.event.x
			initalContentX = parseSvg(content.attr('transform')).translateX
		}

		function dragged() {
			const delta = pointerStart - d3.event.x
			const x = Math.min(
				Math.max(initalContentX - delta, svgWidth - contentWidth),
				0,
			)

			content.attr('transform', `translate(${x})`)
		}

		function dragended() {
			svg.attr('cursor', 'grab')
		}
	}

	reset() {
		this.drag?.on('start', null).on('drag', null).on('end', null)
		this._setupDrag()
	}
}
