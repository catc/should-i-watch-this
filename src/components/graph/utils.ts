import { Season } from '../../utils/types'

// returns range + 1
export const generateRange = (seasons: Season[]) => {
	return seasons.reduce(
		(ranges, season, i) => {
			const size = season.Episodes.length
			const prev = ranges[i]
			ranges.push(prev + size)
			return ranges
		},
		[0],
	)
}

interface CalcSpacingProps {
	chartWidth: number
	items: number
	dotSize: number
	minSpacing: number
}
export const calcSpacing = ({
	items,
	chartWidth,
	dotSize,
	minSpacing,
}: CalcSpacingProps) => {
	return Math.max(minSpacing, (chartWidth - items * dotSize) / items)
}

const COLORS = [
	'#f44336',
	'#9c27b0',
	'#2196f3',
	'#009688',
	'#8bc34a',
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
