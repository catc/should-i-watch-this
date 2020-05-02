import axios from 'axios'
import { ShowData, Season } from './types'
import times from 'lodash/times'

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
		console.log(data)
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

const getSeason = async (id: string, season: number) => {
	try {
		const { data } = await omdb.get('', {
			params: {
				i: id,
				Season: season,
			},
		})
		data.totalSeasons = parseInt(data.totalSeasons, 10)
		data.Season = parseInt(data.Season, 10)
		data.Episodes.forEach((episode: any) => {
			episode.Episode = parseInt(episode.Episode, 10)
			episode.imdbRating = parseFloat(episode.imdbRating)
		})
		return data as Season
	} catch (err) {
		console.error('error season', err)
	}
	return null
}

export const getAllSeasons = async (id: string, totalSeasons: number) => {
	if (typeof totalSeasons !== 'number') {
		throw new Error('totalSeasons must be a number')
	}

	const reqs = times(totalSeasons, i => getSeason(id, i + 1))

	try {
		const seasons = await Promise.all(reqs)
		return seasons.filter((s): s is Season => s != null)
	} catch (err) {
		console.error('error fetching seasons', err)
	}
	return null
}
