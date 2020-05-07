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
	const linepath = content.append('path').attr('class', 'dot-line')

	function getXY(xScale: any, yScale: any, size: number) {
		return {
			getx: (episode: Episode) => {
				return xScale(String(episode.Season)) + (episode.Episode - 1) * size
			},
			gety: (episode: Episode) => yScale(episode.imdbRating),
		}
	}

	function generateLine(getx: any, gety: any, episodes: Episode[]) {
		return d3.line().x(getx).y(gety).curve(d3.curveMonotoneX)(episodes)
	}

	function addDots(selection: EpisodeSelectionType) {
		return selection
			.attr('class', 'dot')
			.attr('r', DOT_SIZE)
			.attr('fill', (episode: Episode) => getColor(episode.Season))
	}

	function positionDots(selection: EpisodeSelectionType, getx: any, gety: any) {
		return selection.attr('cx', getx).attr('cy', gety)
	}

	async function animateMainContent(
		episodes: Episode[],
		xScale: any,
		size: number,
		fadeout?: boolean,
	) {
		const t = svg.transition().duration(750) // TODO

		if (!fadeout) {
			// hide line
			const linecomplete = linepath.transition(t).style('opacity', 0).end()
			// hide dots
			content.selectAll('.dot').transition(t).style('opacity', 0)

			await linecomplete
		}

		const { getx, gety } = getXY(xScale, yScale, size)
		const line = generateLine(getx, gety, episodes)
		linepath.attr('d', line)
		const len = linepath.node()!.getTotalLength()

		// animate line
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
	}

	animateMainContent(episodes, xScale, SIZE, true)

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
				RANGES,
				SIZE,
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

			animateMainContent(episodes, xScale, SIZE)
		},
	})
}
