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
