import React, { useState, useEffect, useRef } from 'react'
import { SearchResult } from '../utils/api'
import useAppState from '../hooks/useAppState'

interface Props {
	results: SearchResult[]
	clear: (resetTerm?: boolean) => void
}

enum KEY_CODES {
	UP = 38,
	DOWN = 40,
	ENTER = 13,
	ESC = 27,
}

const hasPoster = (url: string) => url.toLowerCase() !== 'n/a'

export default function SearchResults({ results, clear }: Props) {
	const { selectShow } = useAppState()
	const [focused, setFocus] = useState(-1)
	const focusedRef = useRef<HTMLLIElement>(null)

	useEffect(() => {
		if (results && results.length) {
			/*
				annoyingly adds the handler each time focused is changed,
				could also add focused to useRef and read from that to avoid
			 */
			const handler = (e: KeyboardEvent) => {
				switch (e.keyCode) {
					case KEY_CODES.ESC:
						clear()
						break
					case KEY_CODES.UP:
						setFocus(ind => Math.max(ind - 1, 0))
						focusedRef.current?.scrollIntoView(false)
						break
					case KEY_CODES.DOWN:
						setFocus(ind => Math.min(ind + 1, results.length - 1))
						focusedRef.current?.scrollIntoView(false)
						break
					case KEY_CODES.ENTER:
						clear(true)
						if (focused !== -1) selectShow(results[focused].imdbID)
						break
				}
			}
			document.addEventListener('keydown', handler, false)
			return () => document.removeEventListener('keydown', handler, false)
		} else {
			setFocus(-1)
		}
	}, [clear, focused, results, selectShow])

	function select(id: string) {
		selectShow(id)
		clear()
	}

	if (!results.length) {
		return (
			<div className="search-results search-results__empty">no results found</div>
		)
	}

	return (
		<ul className="search-results">
			{results.map((r, i) => (
				<li
					className={`search-result ${i === focused ? 'focused' : ''}`}
					key={r.imdbID}
					onClick={() => select(r.imdbID)}
					ref={i === focused ? focusedRef : null}
				>
					<div className="search-result__poster">
						{hasPoster(r.Poster) ? <img src={r.Poster} alt="poster" /> : null}
					</div>
					<span>
						{r.Title} <span className="search-result__year">({r.Year})</span>
					</span>
				</li>
			))}
		</ul>
	)
}
