import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { searchShows, SearchResult } from '../utils/api'
import SearchResults from './Results'
import { ReactComponent as SearchIcon } from './icons/magnifying-glass.svg'
import debounce from 'lodash/debounce'

export default function SearchBar() {
	const ref = useRef<HTMLInputElement>(null)
	const [term, setTerm] = useState('')
	const [results, setResults] = useState<SearchResult[] | null>(null)

	// clear results
	const clear = useCallback(() => setResults(null), [])

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

	return (
		<div className="search-container">
			<div className="search">
				<div className="search-bar__wrapper" onClick={() => ref.current?.click()}>
					<input
						ref={ref}
						className="search-bar"
						placeholder="Find shows"
						value={term}
						onChange={e => setTerm(e.target.value)}
						type="text"
						autoFocus
					/>
					<div className="search-bar__button">
						<SearchIcon />
					</div>
				</div>
				{results && <SearchResults results={results} clear={clear} />}
			</div>
		</div>
	)
}
