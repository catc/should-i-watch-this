import { ChartValues } from './utils'
import * as d3 from 'd3'

export function createYAxis(svg: any, chartHeight: number, svgContentWidth: number) {
	const yScale = d3.scaleLinear().domain([0, 10]).range([chartHeight, 0])

	svg.call(d3.axisLeft(yScale).tickSizeOuter(0))
		.selectAll('line')
		.attr('x2', svgContentWidth)
		.attr('class', (_, i: number) => (i === 8 ? 'y-tick-8' : 'y-tick'))
		.filter((_, i: number) => i === 0) // remove horizontal tick for 0
		.remove()

	// y axis text
	svg.selectAll('text').attr('class', 'y-axis-text')

	// y axis line
	svg.select('.domain').attr('class', 'y-axis-line')

	// label
	// svg.append('text')
	// 	.attr('class', 'y-axis-label')
	// 	.text('Rating')
	// 	.attr('transform', 'rotate(-90)')
	// 	.style('text-anchor', 'middle')
	// 	.attr('y', 0)
	// 	.attr('x', -chartHeight / 2)
	// 	.attr('dy', -36)

	return {
		yScale,
	}
}
