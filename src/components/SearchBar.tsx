import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { search, SearchResult } from '../utils/api'
import SearchResults from './Results'
import useAppState from '../hooks/useAppState'
import { ReactComponent as SearchIcon } from './icons/magnifying-glass.svg'
import debounce from 'lodash/debounce'

enum KEY_CODES {
	UP = 38,
	DOWN = 40,
	ENTER = 13,
	ESC = 27,
}
// const KEY_CODES = {
// 	UP: 38,
// 	DOWN: 40,
// 	ENTER: 13,
// 	ESC: 27,
// }

export default function SearchBar() {
	const ref = useRef<HTMLInputElement>(null)
	const { selectShow } = useAppState()
	const [term, setTerm] = useState('community')
	const [results, setResults] = useState<SearchResult[] | null>(null)

	const clear = useCallback(() => setResults(null), [])

	const submit = useCallback(
		async (term: string) => {
			clear()
			const results = await search(term)
			setResults(results)
		},
		[clear],
	)

	const debounced = useMemo(() => debounce(submit, 700), [submit])

	useEffect(() => {
		if (term && term.length >= 2) {
			debounced(term)
			return () => debounced.cancel()
		} else {
			clear()
		}
	}, [clear, debounced, term])

	async function select(id: string) {
		clear()
		selectShow(id)
	}

	function handleResultsNav(e: React.KeyboardEvent<HTMLInputElement>) {
		if (!results) return
		switch (e.keyCode) {
			case KEY_CODES.ESC:
				setResults(null)
				setTerm('')
				break
		}
	}

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
						onKeyDown={handleResultsNav}
					/>
					<div className="search-bar__button">
						<SearchIcon />
					</div>
				</div>
				{results && <SearchResults results={results} select={select} />}
			</div>
		</div>
	)
}
