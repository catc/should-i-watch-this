import React, { useEffect, useRef, useCallback } from 'react'
import useAppState from '../../hooks/useAppState'

// import { create } from 'd3-selection'
import mock1 from './mock/mock1'
import { setupChart } from './gen'

export default function Graph() {
	const { selectedShow } = useAppState()
	const ref = useRef(null)

	const select = useCallback(data => {
		setupChart(ref.current, data)
	}, [])
	// function select(data) {
	// }

	useEffect(() => {
		// if (selectedShow && ref.current) {
		if (selectedShow && ref.current) {
			// const episodes = flatMap(selectedShow.seasons, season => season.Episodes)
			// setupChart(ref.current, mock1)
			select(mock1)
		}
	}, [selectedShow])

	if (!selectedShow) {
		return null
	}

	// window.f = flatten
	// window.fm = flatMap
	// window.data = selectedShow
	// console.log(selectedShow)

	return (
		<div>
			<button onClick={() => select(mock1)}>One</button>
			<button onClick={() => select(selectedShow)}>Two</button>
			<br />
			<div className="graph" ref={ref} />
		</div>
	)
}
