import React, { useState, FormEvent } from 'react'
import { search, SearchResult } from '../utils/api'
import SearchResults from './Results'
import useAppState from '../hooks/useAppState'

interface Props {
	// ...
}

export default function SearchBar({}: Props) {
	const { selectShow } = useAppState()
	const [term, setTerm] = useState('community')
	const [results, setResults] = useState<SearchResult[] | null>(null)

	async function submit(e: FormEvent) {
		setResults(null)
		e.preventDefault()

		const results = await search(term)
		setResults(results)
	}

	async function select(id: string) {
		setResults(null)

		selectShow(id)
	}

	return (
		<div>
			<form onSubmit={submit}>
				<input
					className="search-bar"
					placeholder="Search show..."
					value={term}
					onChange={e => setTerm(e.target.value)}
					type="text"
					autoFocus
				/>
			</form>

			{results && <SearchResults results={results} select={select} />}
		</div>
	)
}
