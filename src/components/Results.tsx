import React from 'react'
import { SearchResult } from '../utils/api'

interface Props {
	results: SearchResult[]
	select: (id: string) => void
}

export default function SearchResults({ results, select }: Props) {
	if (!results.length) {
		return <div>no results :(</div>
	}
	return (
		<ul className="search-results">
			{results.map(r => (
				<li
					className="search-result"
					key={r.imdbID}
					onClick={() => select(r.imdbID)}
				>
					{r.Title} ({r.Year})
				</li>
			))}
		</ul>
	)
}
