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
	const svg = useRef(null)
	// const { cu/rrent: svg } = svgRef

	const [tooltipData, setTooltipData] = useState(null)

	const tooltip = useCallback((episode: Episode | null) => {
		setTooltipData(episode)
	}, [])

	const setRef = useCallback(node => {
		if (ref.current) {
			// ON REMOVE
			// observer.disconnect()
			console.log('remove')
		}

		if (node) {
			// ON ENTER
			// select()
			// console.log('added!')
			// LEFT OFF HERE - bands arent calculated correctly, check with stuff here
			// const s = setupChart(node, selectedShow?.seasons)
			// const s = setupChart(node, mock1)
			// console.log(s)
			// svg.current = s
		}

		ref.current = node
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
			const s = setupChart(ref.current, mock1, tooltip)
			// const s = setupChart(ref.current, selectedShow.seasons, tooltip)
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
			<div className="tooltip-wrapper">
				{tooltipData && (
					<div className="tooltip">
						season:episode :: {tooltipData.Season} : {tooltipData.Episode}
						<br />
						Rating: {tooltipData.imdbRating}
					</div>
				)}
			</div>
			<br />
			<div className="graph" ref={setRef} />
		</div>
	)
}
