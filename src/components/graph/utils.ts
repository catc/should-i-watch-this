import { Season, Episode } from '../../utils/types'
import { DOT_SIZE, MIN_SPACING, PADDING } from './constants'

// returns range + 1
const generateRange = (seasons: Season[]) => {
	return seasons.reduce(
		(ranges, season, i) => {
			// use last episode of season for full number of episodes in season
			const size = season.Episodes[season.Episodes.length - 1].Episode
			const prev = ranges[i]
			ranges.push(prev + size)
			return ranges
		},
		[0],
	)
}

interface CalcSpacingProps {
	svgWidth: number
	items: number
	dotSize: number
	minSpacing: number
}
const calcSpacing = ({ items, svgWidth, dotSize, minSpacing }: CalcSpacingProps) =>
	Math.max(minSpacing, (svgWidth - items * dotSize) / items)

export interface ChartValues {
	DOT_SPACING: number
	SIZE: number
	RANGES: number[]
	RANGES_NORMALIZED: number[]
	RANGES_NORMALIZED_NO_LAST: number[]
	TOTAL_WIDTH: number
	VERTICAL_LINE_ADJUST: number
}

export const calcChartValues = (
	svgWidth: number,
	seasons: Season[],
	totalEpisodes: number,
): ChartValues => {
	const DOT_SPACING = calcSpacing({
		items: totalEpisodes,
		svgWidth: svgWidth,
		dotSize: DOT_SIZE,
		minSpacing: MIN_SPACING,
	})
	const SIZE = DOT_SIZE + DOT_SPACING

	const RANGES = generateRange(seasons)
	const RANGES_NORMALIZED = RANGES.map(band => band * SIZE + PADDING)
	const RANGES_NORMALIZED_NO_LAST = RANGES_NORMALIZED.slice(
		0,
		RANGES_NORMALIZED.length - 1,
	)
	// -dot_spacing since don't need right margin
	const TOTAL_WIDTH =
		RANGES_NORMALIZED[RANGES.length - 1] - DOT_SPACING + PADDING - DOT_SIZE

	const VERTICAL_LINE_ADJUST = SIZE / 2

	return {
		DOT_SPACING,
		SIZE,
		RANGES,
		RANGES_NORMALIZED,
		RANGES_NORMALIZED_NO_LAST,
		TOTAL_WIDTH,
		VERTICAL_LINE_ADJUST,
	}
}

const COLORS = [
	'#f44336',
	'#9c27b0',
	'#009688',
	'#8bc34a',
	'#2196f3',
	'#ffc107',
	'#fb8c00',
	// '#2c7bb6',
	// '#00a6ca',
	// '#00ccbc',
	// '#90eb9d',
	// '#ffff8c',
	// '#f9d057',
	// '#f29e2e',
	// '#e76818',
	// '#d7191c',
]
export function getColor(i: number) {
	return COLORS[i % COLORS.length]
}
