import * as d3 from 'd3'

import flatten from 'lodash/flatten'
import flatMap from 'lodash/flatMap'
import { Season, Episode } from '../../utils/types'
import {
	getColor,
	calcChartValues,
	// constants
	DOT_SIZE,
	MIN_SPACING,
	PADDING,
} from './utils'

// const DOT_SIZE = 5
// const MIN_SPACING = 15 // min spacing between dots
// const PADDING = 20 // left and right padding of line

type SeasonSelectionType = d3.Selection<any, Season, SVGElement, any>
type EpisodeSelectionType = d3.Selection<any, Episode, SVGElement, any>

const fadeIn = (selection, t) =>
	selection.style('opacity', '0').transition(t).style('opacity', 1)
// selection.transition(t).style('opacity', 1)
const fadeOut = (selection, t) => selection.transition(t).style('opacity', 0)

const CHART_WIDTH = 800 // TODO - this should calculated
const CHART_HEIGHT = 500 //. TODO - this should be calculted

export function setupChart(ref, seasons: Season[]) {
	const episodes = flatMap(seasons, season => {
		season.Episodes.forEach(e => (e.Season = season.Season))
		return season.Episodes
	})

	const svg = d3
		.select(ref)
		.append('svg')
		.attr('width', CHART_WIDTH)
		.attr('height', CHART_HEIGHT)

	const {
		DOT_SPACING,
		SIZE,
		RANGES,
		RANGES_NORMALIZED,
		RANGES_NORMALIZED_NO_LAST,
		TOTAL_WIDTH,
		VERTICAL_LINE_ADJUST,
	} = calcChartValues(CHART_WIDTH, seasons, episodes.length)
	//  ---------------------------------------

	// -------------------------

	// x axis
	const xaxis = svg
		.append('g')
		.attr('transform', 'translate(0,' + CHART_HEIGHT + ')')
		.attr('id', 'x-axis')

	const xAxisLine = xaxis
		.append('line')
		.attr('class', 'x-axis')
		.attr('y1', 0)
		.attr('y2', 0)
		.attr('x1', 0)
		.attr('x2', TOTAL_WIDTH)

	// const xaxisLine =

	// const VERTICAL_LINE_ADJUST = SIZE / 2

	// // x axis text
	// xaxis
	// 	.selectAll('text')
	// 	.data(seasons)
	// 	.join('text')
	// 	.attr('class', 'x-axis-text')
	// 	.text(d => `Season ${d.Season}`)
	// 	.attr('y', 18)
	// 	.attr('x', (_, i) => {
	// 		const current = RANGES_NORMALIZED[i + 1]
	// 		const prev = RANGES_NORMALIZED[i]
	// 		return (current - prev) / 2 + prev - VERTICAL_LINE_ADJUST
	// 	})

	// // x axis vertical lines
	// xaxis
	// 	.append('g')
	// 	.attr('id', 'x-divider-lines')
	// 	.selectAll('line.season')
	// 	// lines
	// 	// .data(RANGES_NORMALIZED_NO_LAST.filter((_, i) => i !== 0))
	// 	.data(RANGES_NORMALIZED.filter((_, i) => i !== 0)) // FOR TESTING ONLY
	// 	.join('line')
	// 	.attr('class', 'vertical-season-line')
	// 	.attr('y1', 0)
	// 	.attr('y2', -CHART_HEIGHT)
	// 	.attr('x1', (d, i) => d - VERTICAL_LINE_ADJUST)
	// 	.attr('x2', (d, i) => d - VERTICAL_LINE_ADJUST)

	// // -------------------------

	// const yScale = d3.scaleLinear().domain([0, 10]).range([CHART_HEIGHT, 0])

	// svg.append('g').attr('id', 'y-axis').call(d3.axisLeft(yScale)) // Create an axis component with d3.axisLeft

	// const getx = (episode: Episode) =>
	// 	xScale(String(episode.Season)) + (episode.Episode - 1) * SIZE
	// const gety = (episode: Episode) => yScale(episode.imdbRating)

	// const content = svg.append('g').attr('id', 'content')

	// // line
	// const line = d3.line().x(getx).y(gety).curve(d3.curveMonotoneX)
	// content.append('path').datum(episodes).attr('class', 'dot-line').attr('d', line)

	// // dots
	// content
	// 	.selectAll('.dot')
	// 	.data(episodes)
	// 	.join('circle')
	// 	.attr('class', 'dot')
	// 	.attr('cx', getx)
	// 	.attr('cy', gety)
	// 	.attr('r', DOT_SIZE)
	// 	.attr('fill', episode => getColor(episode.Season))

	//  ----------------------

	function xAxisTextGetX(rangesNormalized: number[], verticalLineAdjust: number) {
		return (_, i) => {
			const current = rangesNormalized[i + 1]
			const prev = rangesNormalized[i]
			return (current - prev) / 2 + prev - verticalLineAdjust
		}
	}

	function addXAxisText(
		selection: SeasonSelectionType,
		rangesNormalized: number[],
		verticalLineAdjust: number,
	) {
		return selection
			.attr('class', 'x-axis-text')
			.text(season => `Season ${season.Season}`)
			.attr('y', 18)
			.attr('x', xAxisTextGetX(rangesNormalized, verticalLineAdjust))
	}

	// text
	xaxis
		.selectAll<any, Season>('text')
		.data(seasons, (season: Season) => String(season.Season))
		.join('text')
		.call(addXAxisText, RANGES_NORMALIZED, VERTICAL_LINE_ADJUST)

	// ---------------
	function addXAxisTicks(
		selection: SeasonSelectionType,
		verticalLineAdjust: number,
		chartHeight: number,
	) {
		return selection
			.attr('class', 'vertical-season-line')
			.attr('y1', 0)
			.attr('y2', -chartHeight)
			.attr('x1', d => d - verticalLineAdjust)
			.attr('x2', d => d - verticalLineAdjust)
	}

	const xAxisTicks = xaxis.append('g').attr('id', 'x-divider-lines')

	// ticks
	xAxisTicks
		.selectAll('line')
		// .data(RANGES_NORMALIZED_NO_LAST.filter((_, i) => i !== 0))
		.data(RANGES_NORMALIZED.filter((_, i) => i !== 0)) // FOR TESTING ONLY
		.join('line')
		.call(addXAxisTicks, VERTICAL_LINE_ADJUST, CHART_HEIGHT)

	// ---------------

	const yScale = d3.scaleLinear().domain([0, 10]).range([CHART_HEIGHT, 0])
	const xScale = d3
		.scaleOrdinal()
		// .scaleBand()
		.domain(seasons.map(season => String(season.Season)))
		.range(RANGES_NORMALIZED_NO_LAST)

	svg.append('g').attr('id', 'y-axis').call(d3.axisLeft(yScale))
	const content = svg.append('g').attr('id', 'content')

	function getXY(xScale, yScale, size) {
		return {
			getx: (episode: Episode) => {
				return xScale(String(episode.Season)) + (episode.Episode - 1) * size
			},
			gety: (episode: Episode) => yScale(episode.imdbRating),
		}
	}
	function generateLine(getx, gety, episodes) {
		return d3.line().x(getx).y(gety).curve(d3.curveMonotoneX)(episodes)
	}

	// function genget(xx, yy) {
	// 	const getx = (episode: Episode) => {
	// 		console.log(episode.Episode)
	// 		return xx(String(episode.Season)) + (episode.Episode - 1) * SIZE
	// 	}
	// 	const gety = (episode: Episode) => yy(episode.imdbRating)
	// 	return { getx, gety }
	// }
	// const getx = (episode: Episode) =>
	// 	xScale(String(episode.Season)) + (episode.Episode - 1) * SIZE
	// const gety = (episode: Episode) => yScale(episode.imdbRating)

	// line
	// const line = d3.line().x(getx).y(gety).curve(d3.curveMonotoneX)
	// const line = d3.line().x(getx).y(gety).curve(d3.curveMonotoneX)

	// const foo = selection => selection
	//.x(getx).y(gety).curve(d3.curveMonotoneX)
	// console.log(d3.line().call)
	// return
	// const line = d3.line().call(drawLine, xScale, yScale)
	const linepath = content.append('path')

	const { getx, gety } = getXY(xScale, yScale, SIZE)
	const line = generateLine(getx, gety, episodes)
	// const line = generateLine(getx, gety)

	linepath
		// .datum(episodes)
		.attr('class', 'dot-line')
		.attr('d', line)

	function addDots(selection: EpisodeSelectionType) {
		return selection
			.attr('class', 'dot')
			.attr('r', DOT_SIZE)
			.attr('fill', (episode: Episode) => getColor(episode.Season))
	}

	function positionDots(selection: EpisodeSelectionType, getx: any, gety: any) {
		return selection.attr('cx', getx).attr('cy', gety)
	}

	// dots
	content
		.selectAll<any, Episode>('.dot')
		.data(episodes, (episode: Episode) => String(episode.Episode))
		.join('circle')
		.call(addDots)
		.call(positionDots, getx, gety)

	/*


	*/

	return Object.assign(svg.node(), {
		async update(seasons: Season[]) {
			const episodes = flatMap(seasons, season => {
				season.Episodes.forEach(e => (e.Season = season.Season))
				return season.Episodes
			})

			const t = svg.transition().duration(750)

			const VALUES = calcChartValues(CHART_WIDTH, seasons, episodes.length)
			const {
				DOT_SPACING,
				SIZE,
				RANGES,
				RANGES_NORMALIZED,
				RANGES_NORMALIZED_NO_LAST,
				TOTAL_WIDTH,
				VERTICAL_LINE_ADJUST,
			} = VALUES

			// x axis line
			xAxisLine.transition(t).attr('x2', TOTAL_WIDTH)

			// x axis text
			xaxis
				.selectAll<any, Season>('text')
				.data(seasons, (season: Season) => String(season.Season))
				.join(
					enter =>
						enter
							.append('text')
							.call(addXAxisText, RANGES_NORMALIZED, VERTICAL_LINE_ADJUST)
							.style('opacity', 0),
					update => update,
					exit => exit.transition(t).style('opacity', 0).remove(),
				)
				.transition(t)
				.attr('x', xAxisTextGetX(RANGES_NORMALIZED, VERTICAL_LINE_ADJUST))
				.style('opacity', 1)

			// x axis vertical ticks
			xAxisTicks
				.selectAll('line')
				// .data(RANGES_NORMALIZED_NO_LAST.filter((_, i) => i !== 0))
				.data(RANGES_NORMALIZED.filter((_, i) => i !== 0)) // FOR TESTING ONLY
				.join(
					enter =>
						enter
							.append('line')
							.call(addXAxisTicks, VERTICAL_LINE_ADJUST, CHART_HEIGHT)
							.style('opacity', 0),
					update => update,
					exit => exit.transition(t).style('opacity', 0).remove(),
				)
				.transition(t)
				.attr('x1', d => d - VERTICAL_LINE_ADJUST)
				.attr('x2', d => d - VERTICAL_LINE_ADJUST)
				.style('opacity', 1)

			//  ---------------------------------------
			xScale
				.domain(seasons.map(season => String(season.Season)))
				.range(RANGES_NORMALIZED_NO_LAST)

			// hide line
			const linecomplete = linepath.transition(t).style('opacity', 0).end()
			// hide dots
			content.selectAll('.dot').transition(t).style('opacity', 0)

			await linecomplete

			const { getx, gety } = getXY(xScale, yScale, SIZE)

			// animate line
			const line = generateLine(getx, gety, episodes)
			linepath.attr('d', line)
			const len = linepath.node()!.getTotalLength()
			linepath
				// set empty stroke
				.attr('stroke-dasharray', len + ' ' + len)
				.attr('stroke-dashoffset', len)
				.style('opacity', 1)
				// draw in
				.transition()
				.duration(2000)
				.ease(d3.easeLinear)
				.attr('stroke-dashoffset', 0)

			// animate dots
			const totalepisodes = episodes.length
			content
				.selectAll<any, Episode>('.dot')
				.data(episodes, (episode: Episode) => String(episode.Episode))
				.join(enter => enter.append('circle').call(addDots))
				.call(positionDots, getx, gety)
				.style('opacity', 0)
				// fade in
				.transition()
				.duration(200)
				.ease(d3.easeLinear)
				.delay((_, i) => (2000 / totalepisodes) * (i + 2))
				.style('opacity', 1)
		},
	})
}
