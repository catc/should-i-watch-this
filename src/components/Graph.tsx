import React from 'react'
import useAppState from '../hooks/useAppState'

export default function Graph() {
	const { selectedShow } = useAppState()

	if (!selectedShow) {
		return null
	}

	console.log(selectedShow)

	return <div>a graph</div>
}
