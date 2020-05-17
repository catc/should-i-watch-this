import React, { useState, useEffect, useRef } from 'react'
import { SearchResult } from '../utils/api'

interface Props {
	results: SearchResult[] | null
	highlighted: number
	select: (i: number) => void
}

const hasPoster = (url: string) => url.toLowerCase() !== 'n/a'

export default function SearchResults({ results, highlighted, select }: Props) {
	const highlightedRef = useRef<HTMLLIElement>(null)

	useEffect(() => {
		highlightedRef.current?.scrollIntoView(false)
	}, [highlighted])

	if (!results) {
		return null
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
					className={`search-result ${i === highlighted ? 'higlighted' : ''}`}
					key={r.imdbID}
					onClick={() => select(i)}
					ref={i === highlighted ? highlightedRef : null}
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
