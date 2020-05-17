import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import SearchResults from './Results'
import { ReactComponent as SearchIcon } from './icons/magnifying-glass.svg'
import useSearch from './hooks/useSearch'
import useAppState from '../hooks/useAppState'

enum KEY_CODES {
	UP = 38,
	DOWN = 40,
	ENTER = 13,
	ESC = 27,
}

export default function SearchBar() {
	const ref = useRef<HTMLInputElement>(null)
	const { selectShow } = useAppState()
	const { bind, setTerm, results } = useSearch()

	const [highlighted, setHighlighted] = useState(-1)
	const [displayResults, setDisplayResults] = useState(false)

	// if results change, display and reset highlighted
	useEffect(() => {
		setHighlighted(-1)
		setDisplayResults(true)
	}, [results])

	const onFocus = useCallback(() => {
		if (results) setDisplayResults(true)
	}, [results])
	// need to set timeout so blur doesn't trigger before results click
	const onBlur = useCallback(e => setTimeout(() => setDisplayResults(false), 200), [])

	const select = useCallback(
		(index: number) => {
			if (results && results[index]) {
				selectShow(results[index].imdbID)
				setTerm('')
			}
		},
		[results, selectShow, setTerm],
	)

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			switch (e.keyCode) {
				case KEY_CODES.ESC:
					setDisplayResults(false)
					break
				case KEY_CODES.UP:
					results && setHighlighted(ind => Math.max(ind - 1, 0))
					break
				case KEY_CODES.DOWN:
					if (results) {
						setDisplayResults(true)
						setHighlighted(ind => Math.min(ind + 1, results.length - 1))
					}
					break
				case KEY_CODES.ENTER:
					select(highlighted)
					break
			}
		}
		document.addEventListener('keydown', handler, false)
		return () => document.removeEventListener('keydown', handler, false)
	}, [highlighted, results, select, selectShow])

	return (
		<>
			<header>
				<h1>Is it worth watching?</h1>
			</header>
			<div className="search-container">
				<div className="search">
					<div
						className="search-bar__wrapper"
						onClick={() => ref.current?.click()}
					>
						<input
							{...bind}
							ref={ref}
							className="search-bar"
							placeholder="Search shows"
							type="text"
							autoFocus
							onFocus={onFocus}
							onBlur={onBlur}
						/>
						<div className="search-bar__button">
							<SearchIcon />
						</div>
					</div>

					{displayResults && (
						<SearchResults
							results={results}
							highlighted={highlighted}
							select={select}
						/>
					)}
				</div>
			</div>
		</>
	)
}
