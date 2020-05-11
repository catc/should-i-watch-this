import omitBy from 'lodash/omitBy'
import { ShowData, Season } from './types'

const STORAGE_KEY = 'shows'

export type Show = {
	info: ShowData
	seasons: Season[]
}

type CacheType = {
	[imdbID: string]: {
		added: number
	} & Show
}

export default class Cache {
	private cache: CacheType = {}

	constructor() {
		this.populateCache()
	}

	private populateCache() {
		const showsraw = localStorage.getItem(STORAGE_KEY)

		if (showsraw === null) return
		try {
			const shows = JSON.parse(showsraw)

			const d = new Date()
			const EXPIRED_DATE = d.setDate(d.getDate() - 5)

			this.cache = omitBy(shows, show => {
				// older than n days, remove
				return false
				// TODO - reenable
				// return show.added < EXPIRED_DATE
			})
		} catch (err) {
			console.error('error parsing cached shows', err)
		}
	}

	has(id: string) {
		return id in this.cache
	}

	get(id: string) {
		return this.cache[id]
	}

	set(show: ShowData, seasons: Season[]) {
		this.cache[show.imdbID] = {
			added: new Date().getTime(),
			info: show,
			seasons,
		}
		localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache))
	}
}
