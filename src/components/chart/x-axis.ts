import { Season } from '../../utils/types'
import {
	SeasonSelectionType,
	RangeSelectionType,
	D3Selection,
	TransitionType,
} from './constants'
import { ChartValues } from './utils'

function xAxisTextGetX(rangesNormalized: number[], verticalLineAdjust: number) {
	return (_, i) => {
		const current = rangesNormalized[i + 1]
		const prev = rangesNormalized[i]
		return (current - prev) / 2 + prev - verticalLineAdjust
	}
}

function addXAxisText(
	selection: SeasonSelectionType,
	rangesNormalized: number[],
	verticalLineAdjust: number,
) {
	return (
		selection
			.attr('class', 'x-axis-text')
			.text((season: Season) => `Season ${season.season}`)
			// .attr('y', 18)
			.attr('x', xAxisTextGetX(rangesNormalized, verticalLineAdjust))
	)
}

function addXAxisTicks(
	selection: RangeSelectionType,
	verticalLineAdjust: number,
	chartHeight: number,
) {
	return selection
		.attr('class', 'x-axis-season-line')
		.attr('y1', 0)
		.attr('y2', -chartHeight)
		.attr('x1', d => d - verticalLineAdjust)
		.attr('x2', d => d - verticalLineAdjust)
}

export function createXAxisLine(xaxis: D3Selection) {
	const xAxisLine = xaxis
		.append('line')
		.attr('class', 'x-axis-line')
		.attr('y1', 0)
		.attr('y2', 0)
		.attr('x1', 0)

	return {
		generate(values: ChartValues) {
			const { TOTAL_WIDTH } = values
			xAxisLine.attr('x2', TOTAL_WIDTH)
		},
		update(values: ChartValues, t: TransitionType) {
			const { TOTAL_WIDTH } = values
			xAxisLine.transition(t).attr('x2', TOTAL_WIDTH)
		},
	}
}

export function createXAxisText(xaxis: D3Selection) {
	return {
		generate(values: ChartValues, seasons: Season[]) {
			const { RANGES_NORMALIZED, VERTICAL_LINE_ADJUST } = values
			xaxis
				.selectAll<any, Season>('text')
				.data(seasons, (season: Season) => String(season.season))
				.join('text')
				.call(addXAxisText, RANGES_NORMALIZED, VERTICAL_LINE_ADJUST)
		},
		update(
			values: ChartValues,
			CHART_HEIGHT: number,
			seasons: Season[],
			t: TransitionType,
		) {
			const { RANGES_NORMALIZED, VERTICAL_LINE_ADJUST } = values
			xaxis
				.selectAll<any, Season>('text')
				.data(seasons, (season: Season) => String(season.season))
				.join(
					enter =>
						enter
							.append('text')
							.call(addXAxisText, RANGES_NORMALIZED, VERTICAL_LINE_ADJUST)
							.style('opacity', 0),
					update => update,
					exit => exit.transition(t).style('opacity', 0).remove(),
				)
				.transition(t)
				.attr('x', xAxisTextGetX(RANGES_NORMALIZED, VERTICAL_LINE_ADJUST))
				.style('opacity', 1)
		},
	}
}

export function createXAxisTicks(xaxis: D3Selection) {
	const ticks = xaxis.append('g').attr('id', 'x-divider-lines')
	return {
		generate(values: ChartValues, CHART_HEIGHT: number) {
			const { RANGES_NORMALIZED_NO_LAST, VERTICAL_LINE_ADJUST } = values
			ticks
				.selectAll('line')
				.data(RANGES_NORMALIZED_NO_LAST.filter((_, i) => i !== 0))
				// .data(RANGES_NORMALIZED.filter((_, i) => i !== 0)) // FOR TESTING ONLY
				.join('line')
				.call(addXAxisTicks, VERTICAL_LINE_ADJUST, CHART_HEIGHT)
		},
		update(values: ChartValues, CHART_HEIGHT: number, t: TransitionType) {
			const { RANGES_NORMALIZED_NO_LAST, VERTICAL_LINE_ADJUST } = values
			ticks
				.selectAll('line')
				.data(RANGES_NORMALIZED_NO_LAST.filter((_, i) => i !== 0))
				// .data(RANGES_NORMALIZED.filter((_, i) => i !== 0)) // FOR TESTING ONLY
				.join(
					enter =>
						enter
							.append('line')
							.call(addXAxisTicks, VERTICAL_LINE_ADJUST, CHART_HEIGHT)
							.style('opacity', 0),
					update => update,
					exit => exit.transition(t).style('opacity', 0).remove(),
				)
				.transition(t)
				.attr('x1', d => d - VERTICAL_LINE_ADJUST)
				.attr('x2', d => d - VERTICAL_LINE_ADJUST)
				.style('opacity', 1)
		},
	}
}
