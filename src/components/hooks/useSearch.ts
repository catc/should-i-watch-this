import React, { useCallback, useEffect, useState, useMemo } from 'react'
import debounce from 'lodash/debounce'
import { searchShows, SearchResult } from '../../utils/api'

export default function useSearch() {
	const [term, setTerm] = useState('')
	const [results, setResults] = useState<SearchResult[] | null>(null)

	const clear = useCallback((resetTerm?: boolean) => {
		setResults(null)
		if (resetTerm) setTerm('')
	}, [])

	const search = useCallback(
		async (term: string) => {
			clear()
			const results = await searchShows(term)
			setResults(results)
		},
		[clear],
	)

	const debounced = useMemo(() => debounce(search, 700), [search])

	useEffect(() => {
		if (term && term.length >= 2) {
			debounced(term)
			return () => debounced.cancel()
		} else {
			clear()
		}
	}, [clear, debounced, term])

	const onChange = useCallback(e => {
		setTerm(e.target.value)
	}, [])

	return {
		bind: {
			value: term,
			onChange,
		},
		setTerm,
		results,
	}
}
