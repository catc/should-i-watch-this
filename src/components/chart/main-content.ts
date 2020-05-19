import * as d3 from 'd3'
import { ChartValues, getColor, getXY } from './utils'
import { Season, Episode } from '../../utils/types'
import {
	D3Selection,
	DOT_SIZE,
	EpisodeSelectionType,
	ANIMATE_CONTENT_DURATION,
	ANIMATE_AXIS_DURATION,
} from './constants'
import linearRegression from 'simple-statistics/src/linear_regression'
import linearRegressionLine from 'simple-statistics/src/linear_regression_line'

function generateLine(getx: any, gety: any, episodes: Episode[]) {
	return d3.line().x(getx).y(gety).curve(d3.curveMonotoneX)(episodes as any)
}

function addDots(selection: EpisodeSelectionType) {
	return selection
		.attr('class', 'dot')
		.attr('r', DOT_SIZE)
		.attr('fill', (episode: Episode) => getColor(episode.season))
}

function positionDots(selection: EpisodeSelectionType, getx: any, gety: any) {
	return selection.attr('cx', getx).attr('cy', gety)
}

const getDotOpacity = (selection: any, displayTrendline: boolean) =>
	selection.style('opacity', displayTrendline ? 0.4 : 1)
const getLineOpacity = (selection: any, displayTrendline: boolean) =>
	selection.style('opacity', displayTrendline ? 0 : 1)
const getTrendlineOpacity = (selection: any, displayTrendline: boolean) =>
	selection.style('opacity', displayTrendline ? 1 : 0)

export function createTrendline(episodes: Episode[]) {
	const trend = linearRegression(episodes.map((e, i) => [i, e.rating]))
	const trendline = linearRegressionLine(trend)

	const x1 = 0
	const x2 = episodes.length - 1

	return {
		points: [x1, x2].map(x => [x, trendline(x)]),
		trend,
	}
}

export function createMainContent(
	container: D3Selection,
	yScale: d3.ScaleLinear<number, number>,
) {
	const group = container.append('g').attr('id', 'main-content')
	const bisectorLine = group.append('line').attr('class', 'bisector-line')
	const content = group.append('g')
	const linepath = content.append('path').attr('class', 'dot-line')
	const xScale = d3.scaleOrdinal()

	// trendline
	let displayTrendline = false
	let trend: ReturnType<typeof linearRegression>
	const trendline = d3.line()
	const trendlinepath = group
		.append('path')
		.attr('class', 'trendline')
		.call(getTrendlineOpacity, displayTrendline)

	let isAnimating = false

	async function animate(values: ChartValues, seasons: Season[], episodes: Episode[]) {
		isAnimating = true
		const { RANGES_NORMALIZED_NO_LAST, SIZE } = values

		xScale
			.domain(seasons.map(season => String(season.season)))
			.range(RANGES_NORMALIZED_NO_LAST)

		const { getx, gety } = getXY(xScale, yScale, SIZE)
		const line = generateLine(getx, gety, episodes)
		linepath.attr('d', line)
		const len = linepath.node()!.getTotalLength()

		// animate line
		linepath
			// set empty stroke
			.attr('stroke-dasharray', len + ' ' + len)
			.attr('stroke-dashoffset', len)
			.call(getLineOpacity, displayTrendline)
			// draw in
			.transition()
			.duration(ANIMATE_CONTENT_DURATION)
			.ease(d3.easeLinear)
			.attr('stroke-dashoffset', 0)

		// animate dots
		const totalepisodes = episodes.length
		content
			.selectAll<any, Episode>('.dot')
			.data(episodes, (episode: Episode) => String(episode.episode))
			.join(
				enter => enter.append('circle').call(addDots),
				update => update.call(addDots),
			)
			.call(positionDots, getx, gety)
			.style('opacity', 0)
			// fade in
			.transition()
			.duration(ANIMATE_CONTENT_DURATION / 10)
			.ease(d3.easeLinear)
			.delay((_, i) => (ANIMATE_CONTENT_DURATION / totalepisodes) * (i + 2))
			.call(getDotOpacity, displayTrendline)

		// trendline
		const { points: trendlinePoints, trend: Trend } = createTrendline(episodes)
		trend = Trend
		trendline.x(d => getx(episodes[d[0]])).y(d => yScale(d[1]))
		trendlinepath
			.datum(trendlinePoints)
			.transition()
			.duration(ANIMATE_CONTENT_DURATION)
			.attr('d', trendline)

		isAnimating = false
	}

	return {
		async generate(values: ChartValues, seasons: Season[], episodes: Episode[]) {
			await animate(values, seasons, episodes)
		},
		async update(values: ChartValues, seasons: Season[], episodes: Episode[]) {
			const t = container.transition().duration(ANIMATE_AXIS_DURATION)

			// hide line
			const linecomplete = linepath.transition(t).style('opacity', 0).end()
			// hide dots
			group.selectAll('.dot').transition(t).style('opacity', 0)

			await linecomplete
			await animate(values, seasons, episodes)
		},
		xScale,

		toggleTrendLine() {
			if (isAnimating) return { display: displayTrendline, trend }

			displayTrendline = !displayTrendline
			group.classed('show_trend', displayTrendline)

			const t = group.transition().duration(500)

			content
				.selectAll<any, Episode>('.dot')
				.transition(t)
				.call(getDotOpacity, displayTrendline)

			linepath.transition(t).call(getLineOpacity, displayTrendline)

			trendlinepath.transition(t).call(getTrendlineOpacity, displayTrendline)

			return { display: displayTrendline, trend }
		},
		bisectorLine,
	}
}
