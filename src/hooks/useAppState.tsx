import React, {
	createContext,
	useContext,
	useMemo,
	useState,
	useCallback,
	useEffect,
} from 'react'
import Cache, { Show } from '../utils/cache'
import { getShowInfo, getSeasons } from '../utils/api'

import mock from '../components/chart/dev/mock/gen' // FOR TESTING

type ContextType = {
	selectShow: (id: string) => void
	selectedShow: Show | null
	isLoading: boolean
}

const AppStateContext = createContext<ContextType>({
	selectShow: () => {},
	selectedShow: null,
	isLoading: false,
})

export function Provider({ children }: { children: React.ReactNode }) {
	const cache = useMemo(() => {
		return new Cache()
	}, [])

	const [selectedShow, select] = useState<Show | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const selectShow = useCallback(
		async (id: string) => {
			setIsLoading(true)
			if (!cache.has(id)) {
				const show = await getShowInfo(id)

				if (show == null) {
					return finish('failed to fetch show')
				}

				const seasons = await getSeasons(id)
				if (seasons == null) {
					return finish('failed to fetch seasons')
				}

				// cache
				cache.set(show, seasons)
			}

			// update app
			window.history.replaceState('', '', `?id=${id}`)
			select(cache.get(id))
			finish()

			function finish(msg?: string) {
				if (msg) {
					alert(msg)
				}
				setIsLoading(false)
			}
		},
		[cache],
	)

	// support query params
	useEffect(() => {
		const params = new URLSearchParams(window.location.search)
		if (params.has('id')) {
			selectShow(params.get('id')!)
		}
	}, [selectShow])

	// FOR TESTING
	// useEffect(() => select(mock(10)), [])

	const state = {
		selectShow,
		selectedShow,
		isLoading,
	}

	return <AppStateContext.Provider value={state}>{children}</AppStateContext.Provider>
}

export default function useAppState() {
	return useContext(AppStateContext)
}
