import { ChartValues } from './utils'
import * as d3 from 'd3'

export function createYAxis(svg: any, chartHeight: number, svgContentWidth: number) {
	const yScale = d3.scaleLinear().domain([0, 10]).range([chartHeight, 0])

	svg.call(d3.axisLeft(yScale).tickSizeOuter(0))
		.selectAll('line')
		.attr('x2', svgContentWidth)
		.attr('class', (_, i: number) => (i === 8 ? 'y-tick-em' : 'y-tick'))
		.filter((_, i: number) => i === 0) // remove horizontal tick for 0
		.remove()

	return {
		// create() {},
		yScale,
	}
}
