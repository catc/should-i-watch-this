import * as d3 from 'd3'

import flatten from 'lodash/flatten'
import flatMap from 'lodash/flatMap'
import { Season, Episode } from '../../utils/types'
import { generateRange, calcSpacing, getColor } from './utils'

const DOT_SIZE = 5
const MIN_SPACING = 15 // min spacing between dots
const PADDING = 20 // left and right padding of line

const CHART_WIDTH = 800 // TODO - this should calculated

export function setupChart(ref, seasons: Season[]) {
	const data = flatMap(seasons, season => {
		season.Episodes.forEach(e => (e.Season = season.Season))
		return season.Episodes
	})

	const episodes = data

	console.log('CHART SETUP')
	const width = 600
	const height = 500
	// const svg = d3.create('svg').attr('viewBox', [0, 0, width, height])

	// const margin = { top: 20, right: 30, bottom: 30, left: 40 }
	// const top =

	const svg = d3.select(ref).append('svg').attr('width', width).attr('height', height)

	//  ---------------------------------------

	const DOT_SPACING = calcSpacing({
		items: episodes.length,
		chartWidth: CHART_WIDTH,
		dotSize: DOT_SIZE,
		minSpacing: MIN_SPACING,
	})
	const SIZE = DOT_SIZE + DOT_SPACING

	const RANGES = generateRange(seasons)
	const RANGES_NORMALIZED = RANGES.map(band => band * SIZE + PADDING)
	const RANGES_NORMALIZED_NO_LAST = RANGES_NORMALIZED.slice(
		0,
		RANGES_NORMALIZED.length - 1,
	)
	// -dot_spacing since don't need right margin
	const TOTAL_WIDTH = RANGES_NORMALIZED[RANGES.length - 1] - DOT_SPACING + PADDING

	// -------------------------

	const xScale = d3
		.scaleOrdinal()
		// .scaleBand()
		.domain(seasons.map(season => String(season.Season)))
		.range(RANGES_NORMALIZED_NO_LAST)

	// x axis
	const xaxis = svg
		.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.attr('id', 'x-axis')

	xaxis
		.append('line')
		.attr('class', 'x-axis')
		.attr('y1', 0)
		.attr('y2', 0)
		.attr('x1', 0)
		.attr('x2', TOTAL_WIDTH)

	const VERTICAL_LINE_ADJUST = SIZE / 2

	// x axis text
	xaxis
		.selectAll('text')
		.data(seasons)
		.join('text')
		.attr('class', 'x-axis-text')
		.text(d => `Season ${d.Season}`)
		.attr('y', 18)
		.attr('x', (_, i) => {
			const current = RANGES_NORMALIZED[i + 1]
			const prev = RANGES_NORMALIZED[i]
			return (current - prev) / 2 + prev - VERTICAL_LINE_ADJUST
		})

	// x axis vertical lines
	xaxis
		.append('g')
		.attr('id', 'x-divider-lines')
		.selectAll('line.season')
		// lines
		// .data(RANGES_NORMALIZED_NO_LAST.filter((_, i) => i !== 0))
		.data(RANGES_NORMALIZED.filter((_, i) => i !== 0)) // FOR TESTING ONLY
		.join('line')
		.attr('class', 'vertical-season-line')
		.attr('y1', 0)
		.attr('y2', -height)
		.attr('x1', (d, i) => d - VERTICAL_LINE_ADJUST)
		.attr('x2', (d, i) => d - VERTICAL_LINE_ADJUST)

	// -------------------------

	const yScale = d3.scaleLinear().domain([0, 10]).range([height, 0])

	svg.append('g').attr('id', 'y-axis').call(d3.axisLeft(yScale)) // Create an axis component with d3.axisLeft

	const getx = (episode: Episode) =>
		xScale(String(episode.Season)) + (episode.Episode - 1) * SIZE
	const gety = (episode: Episode) => yScale(episode.imdbRating)

	const content = svg.append('g').attr('id', 'content')

	// line
	const line = d3.line().x(getx).y(gety).curve(d3.curveMonotoneX)
	content.append('path').datum(episodes).attr('class', 'dot-line').attr('d', line)

	// dots
	content
		.selectAll('.dot')
		.data(episodes)
		.join('circle')
		.attr('class', 'dot')
		.attr('cx', getx)
		.attr('cy', gety)
		.attr('r', DOT_SIZE)
		.attr('fill', episode => getColor(episode.Season))

	//  ----------------------
	// test after

	// return Object.assign(svg.node(), {
	// 	update(data){

	// 	}
	// })
}
