import React, {
	useEffect,
	useRef,
	useCallback,
	useMemo,
	useLayoutEffect,
	useState,
} from 'react'
import useAppState from '../../hooks/useAppState'

// import { create } from 'd3-selection'
import mock1 from './mock/mock1'
import { setupChart } from './gen'
import { Episode } from '../../utils/types'

export default function Graph() {
	const { selectedShow } = useAppState()
	const ref = useRef(null)
	const ref2 = useRef(null)
	const svg = useRef(null)
	// const { cu/rrent: svg } = svgRef

	const [tooltipData, setTooltipData] = useState(null)
	// const [tooltipData, setTooltipData] = useState({ Season: 1, Episode: 5 })

	const updateTooltip = useCallback((episode: Episode | null) => {
		// console.log(episode)
		setTooltipData(episode)
	}, [])

	const setRef = useCallback(node => {
		if (ref.current) {
			console.log('remove 1')
		}

		if (node) {
		}

		ref.current = node
	}, [])
	const setRef2 = useCallback(node => {
		if (ref2.current) {
			console.log('remove 2')
		}

		if (node) {
		}

		ref2.current = node
	}, [])

	// const svg = useMemo(() => {
	// 	if (ref.current) {
	// 		return setupChart(ref.current)
	// 	}
	// 	return null
	// }, [ref.current])

	// const select = useCallback(
	// 	data => {
	// 		// const svg = setupChart(ref.current, data)
	// 		if (svg != null) {
	// 			svg.update(data)
	// 		} else {
	// 			console.log('NO SVG')
	// 		}
	// 	},
	// 	[svg],
	// )
	// function select(data) {
	// }
	useEffect(() => {
		if (ref.current && selectedShow) {
			const s = setupChart(ref.current, mock1, updateTooltip)
			setupChart(ref2.current, selectedShow.seasons, updateTooltip)
			svg.current = s
			console.log(selectedShow)
		}
	}, [selectedShow])

	useEffect(() => {
		const handler = e => {
			if (e.keyCode === 37) select(mock1)
			if (e.keyCode === 39) select(selectedShow.seasons)
		}
		document.addEventListener('keydown', handler)
		return () => document.removeEventListener('keydown', handler)
	}, [selectedShow])

	function select(data) {
		if (svg.current) {
			svg.current.update(data)
		}
	}

	useLayoutEffect(() => {
		// if (selectedShow && ref.current) {
		if (ref.current) {
			// const episodes = flatMap(selectedShow.seasons, season => season.Episodes)
			// setupChart(ref.current, mock1)
			// select(mock1)
		}
	}, [selectedShow])

	if (!selectedShow) {
		return null
	}

	return (
		<div>
			<button onClick={() => select(mock1)}>One</button>
			<button onClick={() => select(selectedShow.seasons)}>Two</button>
			{/* <div className="tooltip-wrapper" /> */}
			{/* <br /> */}
			<div className="graph" ref={setRef}>
				{tooltipData && (
					<div className="tooltip">
						season:episode :: {tooltipData.Season} : {tooltipData.Episode}
						<br />
						Rating: {tooltipData.imdbRating}
					</div>
				)}
			</div>

			<div className="graph" ref={setRef2} />
		</div>
	)
}
