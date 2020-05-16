import { calcChartValues } from '../../components/chart/utils'
import flatMap from 'lodash/flatMap'
import { Episode, Season } from '../../utils/types'

jest.mock('../../components/chart/constants', () => {
	const originalModule = jest.requireActual('../../components/chart/constants')
	return {
		...originalModule,
		DOT_SIZE: 5,
		PADDING: 20,
	}
})

const seasons: Season[] = [
	{
		Season: 1,
		Episodes: [
			{ Episode: 1 } as Episode,
			{ Episode: 2 } as Episode,
			{ Episode: 3 } as Episode,
		],
	} as Season,
	{
		Season: 2,
		Episodes: [
			{ Episode: 1 } as Episode,
			{ Episode: 2 } as Episode,
			{ Episode: 3 } as Episode,
			{ Episode: 4 } as Episode,
			{ Episode: 5 } as Episode,
		],
	} as Season,
	{
		Season: 3,
		Episodes: [
			{ Episode: 1 } as Episode,
			{ Episode: 2 } as Episode,
			{ Episode: 3 } as Episode,
			{ Episode: 4 } as Episode,
			{ Episode: 5 } as Episode,
			{ Episode: 6 } as Episode,
			{ Episode: 7 } as Episode,
		],
	} as Season,
]

const episodes = flatMap(seasons, season => {
	season.Episodes.forEach(e => (e.Season = season.Season))
	return season.Episodes
})

describe('calcChartValues', () => {
	it('calculates values correctly', () => {
		const svgWidth = 675
		const totalEpisodes = episodes.length

		const {
			DOT_SPACING,
			SIZE,
			RANGES_NORMALIZED,
			RANGES_NORMALIZED_NO_LAST,
			TOTAL_WIDTH,
			VERTICAL_LINE_ADJUST,
		} = calcChartValues(svgWidth, seasons, totalEpisodes)

		// dot size = 5, spacing = 40
		expect(SIZE).toEqual(45)

		// episodes / season are: 3, 5, 7
		expect(RANGES_NORMALIZED).toEqual([
			20,
			20 + 3 * SIZE,
			20 + 3 * SIZE + 5 * SIZE,
			20 + 3 * SIZE + 5 * SIZE + 7 * SIZE,
		])

		let totalWidth = 20 * 2 // left + right padding
		totalWidth = totalWidth + totalEpisodes * 45 // episodes
		totalWidth = totalWidth - 40 // no right margin (no spacing after last)
		expect(TOTAL_WIDTH).toEqual(totalWidth)
	})
})
