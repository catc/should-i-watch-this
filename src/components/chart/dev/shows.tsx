import React, { useEffect } from 'react'
import useAppState from '../../../hooks/useAppState'
import './style.scss'

const SHOWS = [
	{ id: 'tt0944947', name: 'game of thrones' },
	{ id: 'tt1439629', name: 'community' },
	{ id: 'tt2467372', name: 'brooklyn 99' },
	{ id: 'tt2085059', name: 'black mirror' },
	{ id: 'tt5363918', name: 'disenchantment' },
	{ id: 'tt0773262', name: 'dexter' },
]

export default function DEV_Shows() {
	const { selectedShow, selectShow } = useAppState()

	// FOR TESTING
	useEffect(() => {
		const handler = e => {
			if (e.keyCode === 37) selectShow(SHOWS[0].id)
			if (e.keyCode === 39) selectShow(SHOWS[1].id)
		}
		document.addEventListener('keydown', handler)
		return () => document.removeEventListener('keydown', handler)
	}, [selectShow])

	return (
		<ul className="dev_shows">
			{SHOWS.map(s => (
				<li key={s.id} onClick={() => selectShow(s.id)}>
					{s.name}
				</li>
			))}
		</ul>
	)
}
