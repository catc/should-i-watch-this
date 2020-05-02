import React, { createContext, useContext, useMemo, useState } from 'react'
import Cache, { Show } from '../utils/cache'
import { getShowInfo, getAllSeasons } from '../utils/api'

type ContextType = {
	// cache: Cache
	selectShow: (id: string) => void
	selectedShow: Show | null
}

const AppStateContext = createContext<ContextType>({
	// cache: {} as Cache,
	selectShow: () => {},
	selectedShow: null,
})

export function Provider({ children }: { children: React.ReactNode }) {
	const cache = useMemo(() => {
		return new Cache()
	}, [])

	const [selectedShow, select] = useState<Show | null>(null)

	async function selectShow(id: string) {
		if (!cache.has(id)) {
			const show = await getShowInfo(id)

			if (show == null) {
				console.error('failed to fetch show')
				return
			}

			const seasons = await getAllSeasons(show.imdbID, show.totalSeasons)
			if (seasons == null) {
				console.error('failed to fetch seasons')
				return
			}
			cache.set(show, seasons)
		}
		select(cache.get(id))
	}

	const state = {
		selectShow,
		selectedShow,
	}

	return <AppStateContext.Provider value={state}>{children}</AppStateContext.Provider>
}

export default function useAppState() {
	return useContext(AppStateContext)
}
