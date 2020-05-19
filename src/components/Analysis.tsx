import React, { useCallback, useState, useMemo } from 'react'
import { Show } from '../utils/cache'
import linearRegression from 'simple-statistics/src/linear_regression'
import { getEpisodes } from './chart/gen'
import { createTrendline } from './chart/main-content'

type TrendlineData = {
	display: boolean
	trend: ReturnType<typeof linearRegression>
}

export type ToggleTrendlineFn = () => TrendlineData

/*
	TODO
	- best season
	- trend
		- starts strong, doing worse recently
	- worth watching?
		- if over 8 average?
		- if last 2 seasons average at least 7.5? if at least x seasons?
*/

/*
	TODO - improve "analysis", eg: if at least 4 or 5 seasons, check if second
	half of show is better than first half
*/
function end(seasons: number, m: number) {
	if (seasons < 4) return ''

	const negative = m < 0
	const abs = Math.abs(m)
	if (abs < 0.01) {
		if (negative) {
			return 'Slightly deteriorates in quality over time.'
		}
		return 'Slightly improves in quality over time.'
	} else if (abs < 0.03) {
		if (negative) {
			return 'Deteriorates in quality over time.'
		}
		return 'Improves in quality over time.'
	}
	return ''
}

function Info({ show }: { show: Show }) {
	const { info, seasons } = show
	const rating = parseFloat(info.imdbRating)

	const trend = useMemo(() => {
		const episodes = getEpisodes(seasons)
		return createTrendline(episodes).trend
	}, [seasons])

	let p1
	if (rating > 8) {
		p1 = 'Show is worth watching - good rating. ' + end(seasons.length, trend.m)
	} else if (rating > 7.5) {
		p1 =
			'Show might be worth watching, rating on the lower side. ' +
			end(seasons.length, trend.m)
	} else {
		p1 = 'Based on rating, not recommended - watch at own risk'
	}

	return (
		<div className="analysis__info">
			<div className="analysis__info-icon">{rating > 7.5 ? '👍' : '👎'}</div>
			{p1}
		</div>
	)
}

interface Props {
	show: Show
	toggleTrendline: ToggleTrendlineFn
}

export default function Analysis({
	show,
	toggleTrendline: toggleTrendlineOriginal,
}: Props) {
	const [trendline, setTrendline] = useState<TrendlineData>({} as TrendlineData)

	const toggleTrendline = useCallback(() => {
		if (!toggleTrendlineOriginal) return
		setTrendline(toggleTrendlineOriginal())
	}, [toggleTrendlineOriginal])

	return (
		<div className="analysis" onClick={toggleTrendline}>
			<Info show={show} />

			<div className={`analysis__toggle `}>
				<div className={`analysis__input ${trendline.display ? 'active' : ''}`} />
				<div className="analysis__toggle-label">Toggle trendline</div>
				{trendline.display && (
					<div>
						{trendline.trend.m.toFixed(3)}x + {trendline.trend.b.toFixed(2)}
					</div>
				)}
			</div>

			<div className={`analysis__toggle `}>
				<div className={`analysis__input ${false ? 'active' : ''}`} />
				<div className="analysis__toggle-label">Toggle bisector on hover</div>
			</div>
		</div>
	)
}
