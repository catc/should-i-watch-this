import React, { useRef, useEffect, useState } from 'react'
import useAppState from '../hooks/useAppState'
import { setupChart } from './chart/gen'
import { Episode } from '../utils/types'
import { ReactComponent as CycleIcon } from './icons/cycle.svg'
import InfoPanel from './InfoPanel'

import DevShows from './chart/dev/shows' // FOR TESTING
import { ToggleTrendlineFn } from './Analysis'

type ChartType = ReturnType<typeof setupChart>

const formatEpisodeNumber = (season: number, episode: number) => {
	const e = ('0' + episode).slice(-2)
	const s = ('0' + season).slice(-2)
	return `S${s}E${e}`
}

export default function GraphWrapper() {
	const { selectedShow, isLoading } = useAppState()
	const chartRef = useRef<HTMLDivElement | null>(null)
	const [chart, setChart] = useState<ChartType | null>(null)
	const [tooltip, updateTooltip] = useState<Episode | null>(null)

	function createChart(node: HTMLDivElement) {
		if (node && !chart) {
			console.log(selectedShow)
			setChart(setupChart(node, selectedShow!.seasons, updateTooltip))
		}
		chartRef.current = node
	}

	useEffect(() => {
		if (selectedShow && chart) {
			chart.update(selectedShow.seasons)
		}
	}, [chart, selectedShow])

	if (!selectedShow) {
		return null
	}

	return (
		<div className="chart__container">
			{/* title + tooltip */}
			<div className="chart__title">
				<h2>
					{selectedShow.info.Title} <span>({selectedShow.info.Year})</span>
				</h2>
				<div className="chart__episode">
					{tooltip && (
						<>
							<span className="chart__episode-number">
								{formatEpisodeNumber(tooltip.season, tooltip.episode)}:
							</span>
							<span className="chart__episode-name">
								{tooltip.episodeTitle}
							</span>
							<span className="chart__episode-rating">
								{tooltip.rating} / 10
							</span>
						</>
					)}
				</div>
			</div>

			{/* chart */}
			<div
				className={`chart__wrapper ${isLoading ? 'loading' : ''}`}
				ref={createChart}
			>
				{isLoading && (
					<span className="chart__loading">
						<CycleIcon />
					</span>
				)}
			</div>

			{/* for testing */}
			{/* <DevShows /> */}

			{/* info panel */}
			<InfoPanel
				show={selectedShow}
				toggleTrendline={chart?.toggleTrendline as ToggleTrendlineFn}
				toggleBisectorLine={chart?.toggleBisectorLine as () => boolean}
			/>
		</div>
	)
}
