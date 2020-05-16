import axios from 'axios'
import { ShowData, Season, Episode2, Episode } from './types'
import groupBy from 'lodash/groupBy'

const API_KEY = 'ddf710b6'

const omdb = axios.create({
	baseURL: 'http://www.omdbapi.com/',
})

// until new version is released - https://github.com/axios/axios/issues/2190
omdb.interceptors.request.use(config => {
	config.params.apikey = API_KEY
	return config
})

export type SearchResult = {
	Poster: string
	Title: string
	Type: string
	Year: string
	imdbID: string
}

export const searchShows = async (term: string) => {
	try {
		const { data } = await omdb.get('', {
			params: {
				type: 'series',
				s: term,
			},
		})
		if (data && data.Search) {
			return data.Search as SearchResult[]
		}
	} catch (err) {
		console.error('error searching', err)
	}
	return []
}

export const getShowInfo = async (id: string) => {
	try {
		const { data } = await omdb.get('', {
			params: {
				i: id,
			},
		})
		data.totalSeasons = parseInt(data.totalSeasons, 10)
		return data as ShowData
	} catch (err) {
		console.log('error fetching show', err)
	}
	return null
}

// --------- series squeries

const query = (id: string) =>
	`series.json?sql=select+tconst,+parentTconst,+seasonNumber,+episodeNumber,+seriesTitle,+episodeTitle,+rating,+votes+from+series+where+"parentTconst"+=+"${id}"+order+by+CAST(seasonNumber+as+INT),+CAST(episodeNumber+as+INT)`

const beuke = axios.create({
	baseURL: 'https://imdb.beuke.org/',
})

export const getSeasons = async (id: string) => {
	try {
		const { data } = await beuke(query(id))
		return transformRows(data.columns, data.rows)
	} catch (err) {
		console.error('error fetching episodes', err)
	}
	return null
}

type KeyMap = { [column: string]: keyof Episode2 }
const KEY_MAP: KeyMap = {
	tconst: 'seriesID',
	parentTconst: 'episodeID',
	seasonNumber: 'season',
	episodeNumber: 'episode',
	seriesTitle: 'seriesTitle',
	episodeTitle: 'episodeTitle',
	rating: 'rating',
	votes: 'votes',
}

function transformRows(columns: string[], rows: unknown[][]): Season[] {
	// convert sql rows into objects
	const episodes = rows.map((row: unknown[]) => {
		const episode = {} as Episode
		row.forEach((val: any, i: number) => {
			const sqlkey = columns[i]
			const key = KEY_MAP[sqlkey] || sqlkey
			episode[key] = val
		})
		return episode
	})

	// parse season + episode numbers
	episodes.forEach(episode => {
		episode.season = parseInt(episode.season, 10)
		episode.episode = parseInt(episode.episode, 10)
	})

	const seasons = groupBy(episodes, 'season')

	return Object.keys(seasons).map(season => {
		const episodes = seasons[season]
		return {
			seriesTitle: episodes[0]?.seriesTitle || '',
			season: parseInt(season),
			episodes,
		} as Season
	})
}
