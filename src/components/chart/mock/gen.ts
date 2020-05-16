import times from 'lodash/times'
import { Season, Episode } from '../../../utils/types'

const raw = [{ episodes: 10 }, { episodes: 4 }, { episodes: 10 }, { episodes: 5 }]

function genRating() {
	const MAX = 9.5
	const MIN = 4
	const PRECISION = 100 // 2 decimals

	return (
		Math.floor(
			Math.random() * (MAX * PRECISION - MIN * PRECISION) + MIN * PRECISION,
		) /
		(1 * PRECISION)
	)
}

const data = raw.map((season, seasonIndex) => {
	const episodes = times(season.episodes, episodeIndex => {
		return {
			Episode: episodeIndex + 1,
			imdbRating: genRating(),
			Season: seasonIndex + 1,
		} as Episode
	})

	return {
		Episodes: episodes,
		Season: seasonIndex + 1,
	} as Season
})

export default data
