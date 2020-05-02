import React from 'react'
import { SearchResult } from '../utils/api'

interface Props {
	results: SearchResult[]
	select: (id: string) => void
}

const hasPoster = (url: string) => url.toLowerCase() !== 'n/a'

export default function SearchResults({ results, select }: Props) {
	if (!results.length) {
		return (
			<div className="search-results search-results__empty">no results found</div>
		)
	}
	return (
		<ul className="search-results">
			{results.map(r => (
				<li
					className="search-result"
					key={r.imdbID}
					onClick={() => select(r.imdbID)}
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
