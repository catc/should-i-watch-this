import times from 'lodash/times'
import { Episode, Season } from '../../../../utils/types'

const raw = [{ episodes: 10 }, { episodes: 4 }, { episodes: 10 }, { episodes: 5 }]

function genRating() {
	const MAX = 9.5
	const MIN = 7
	const PRECISION = 10 // 1 decimals

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
			episode: episodeIndex + 1,
			rating: genRating(),
			season: seasonIndex + 1,
		} as Episode
	})

	return {
		episodes: episodes,
		season: seasonIndex + 1,
	} as Season
})

export default function mock(totalSeasons: number, episodesPerSeason = 10) {
	const seasons = times(totalSeasons, seasonIndex => {
		const episodes = times(episodesPerSeason, episodeIndex => {
			return {
				episode: episodeIndex + 1,
				season: seasonIndex + 1,
				rating: genRating(),
				episodeTitle: 'Mock episode',
			} as Episode
		})

		return {
			episodes,
			season: seasonIndex + 1,
		}
	})

	return {
		info: {
			Title: 'Mock Data',
		},
		seasons,
	}
}
