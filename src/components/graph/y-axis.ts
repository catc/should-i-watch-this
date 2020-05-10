import { ChartValues } from './utils'
import * as d3 from 'd3'

export function createYAxis(
	svg: any,
	yScale: d3.ScaleLinear<number, number>,
	values: ChartValues,
) {
	const { TOTAL_WIDTH } = values

	svg.call(d3.axisLeft(yScale).tickSizeOuter(0))
		.selectAll('line')
		.attr('x2', TOTAL_WIDTH)
		.attr('class', (_, i: number) => (i === 8 ? 'y-tick-em' : 'y-tick'))
		.filter((_, i: number) => i === 0) // remove horizontal tick for 0
		.remove()

	return {
		create() {},
	}
}
