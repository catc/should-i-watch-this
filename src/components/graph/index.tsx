import React, { useEffect, useRef } from 'react'
import useAppState from '../../hooks/useAppState'

import flatten from 'lodash/flatten'
import flatMap from 'lodash/flatMap'
import * as d3 from 'd3'
import { Season } from '../../utils/types'
// import { create } from 'd3-selection'
import mock1 from './mock/mock1'
import { generateRange, calcSpacing } from './utils'

export default function Graph() {
	const { selectedShow } = useAppState()
	const ref = useRef(null)

	useEffect(() => {
		if (selectedShow && ref.current) {
			// const episodes = flatMap(selectedShow.seasons, season => season.Episodes)
			setupChart(ref.current, mock1)
		}
	}, [selectedShow])

	if (!selectedShow) {
		return null
	}

	window.f = flatten
	window.fm = flatMap
	window.data = selectedShow
	console.log(selectedShow)

	return <div className="graph" ref={ref} />
}

const DOT_SIZE = 5
const MIN_SPACING = 15 // min spacing between dots
const PADDING = 20 // left and right padding of line

const CHART_WIDTH = 800 // TODO - this should calculated

function setupChart(ref, seasons: Season[]) {
	const data = flatMap(seasons, season => {
		season.Episodes.forEach(e => (e.Season = season.Season))
		return season.Episodes
	})

	const episodes = data

	console.log('CHART SETUP')
	const width = 600
	const height = 500
	// const svg = d3.create('svg').attr('viewBox', [0, 0, width, height])

	const margin = { top: 20, right: 30, bottom: 30, left: 40 }
	// const top =

	const svg = d3.select(ref).append('svg').attr('width', width).attr('height', height)

	const main = svg
		.append('g')
		.attr('transform', 'translate(0,' + 0 + ')')
		.attr('id', 'main')

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
	const xaxis = main
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
	main.append('g')
		.attr('id', 'x-divider-lines')
		.selectAll('line.season')
		// lines
		// .data(RANGES_NORMALIZED_NO_LAST.filter((_, i) => i !== 0))
		.data(RANGES_NORMALIZED.filter((_, i) => i !== 0)) // FOR TESTING ONLY
		.join('line')
		.attr('class', 'vertical-season-line')
		.attr('y1', 0)
		.attr('y2', height)
		.attr('x1', (d, i) => d - VERTICAL_LINE_ADJUST)
		.attr('x2', (d, i) => d - VERTICAL_LINE_ADJUST)

	// -------------------------

	const yScale = d3.scaleLinear().domain([0, 10]).range([height, 0])

	// .call(
	// 	d3.axisBottom(X_SCALE_FIN).tickSizeInner(0).tickPadding(10),
	// 	// .tickValues(a => console.log('a is', a))
	// 	// .tickFormat(seasonNumber => `Season ${seasonNumber}`),
	// )
	// .selectAll('text')
	// .attr('x', (seasonNumber, i, nodes) => {
	// 	// const bandWidth = i
	// 	// console.log('d and i', seasonNumber, i, nodes)
	// 	// console.log(RANGE)
	// })
	// <div className=""></div>

	// 4. Call the y axis in a group tag
	svg.append('g').attr('class', 'y-axis').call(d3.axisLeft(yScale)) // Create an axis component with d3.axisLeft

	const getx = (d, i) => {
		const key = `Season ${d.Season}`
		// const key = d.Season
		// console.log(X_SCALE_FIN(key), d.Episode * (DOT_SIZE + MIN_SPACING))
		// return X_SCALE_FIN(i)
		return xScale(key) + (d.Episode - 1) * (DOT_SIZE + DOT_SPACING)
		// return X_SCALE_FIN(i)
	}
	const gety = d => yScale(d.imdbRating)

	const dots = main.append('g').attr('id', 'dots')

	// dots
	dots.selectAll('.dot')
		.data(episodes)
		.join('circle')
		.attr('class', 'dot')
		.attr('cx', getx)
		.attr('cy', gety)
		.attr('r', DOT_SIZE)
		.attr('fill', episode => getColor(episode.Season))

	// line
	const line = d3.line().x(getx).y(gety).curve(d3.curveMonotoneX)
	dots.append('path').datum(episodes).attr('class', 'dot-line').attr('d', line)

	//  ----------------------
	// test after
	const yAxis = g =>
		g
			.attr('transform', `translate(${margin.left},0)`)
			.call(d3.axisLeft(y))
			.call(g => g.select('.domain').remove())
			.call(g =>
				g
					.select('.tick:last-of-type text')
					.clone()
					.attr('x', 3)
					.attr('text-anchor', 'start')
					.attr('font-weight', 'bold')
					.text(data.y),
			)

	const xAxis = g =>
		g.attr('transform', `translate(0,${height - margin.bottom})`).call(
			d3
				.axisBottom(x)
				.ticks(width / 80)
				.tickSizeOuter(0),
		)

	console.log(
		//
		'donzo',
		// d3.select(ref),
	)
	// svg.append('g').call(xAxis)

	// svg.append('g').call(yAxis)

	// svg.append('path')
	// 	.datum(data)
	// 	.attr('fill', 'none')
	// 	.attr('stroke', 'steelblue')
	// 	.attr('stroke-width', 1.5)
	// 	.attr('stroke-linejoin', 'round')
	// 	.attr('stroke-linecap', 'round')
	// 	.attr('d', line)

	// return svg.node()
	// const chart = {
	// 	const svg = d3.create("svg")
	// 		.attr("viewBox", [0, 0, width, height]);
	// 	svg.append("g")
	// 		.call(xAxis);
	// 	svg.append("g")
	// 		.call(yAxis);
	// 	svg.append("path")
	// 		.datum(data)
	// 		.attr("fill", "none")
	// 		.attr("stroke", "steelblue")
	// 		.attr("stroke-width", 1.5)
	// 		.attr("stroke-linejoin", "round")
	// 		.attr("stroke-linecap", "round")
	// 		.attr("d", line);
	// 	return svg.node();
	// }
}

const COLORS = [
	'#f44336',
	'#9c27b0',
	'#2196f3',
	'#009688',
	'#8bc34a',
	'#ffc107',
	'#fb8c00',
	// '#2c7bb6',
	// '#00a6ca',
	// '#00ccbc',
	// '#90eb9d',
	// '#ffff8c',
	// '#f9d057',
	// '#f29e2e',
	// '#e76818',
	// '#d7191c',
]
function getColor(i: number) {
	return COLORS[i % COLORS.length]
}

function events() {
	const focus = svg.append('g').attr('class', 'focus').style('display', 'none')

	focus.append('circle').attr('r', 4.5)

	focus.append('text').attr('x', 9).attr('dy', '.35em')

	svg.append('rect')
		.attr('class', 'overlay')
		.attr('width', width)
		.attr('height', height)
		.on('mouseover', function() {
			focus.style('display', null)
		})
		.on('mouseout', function() {
			focus.style('display', 'none')
		})
		.on('mousemove', mousemove)

	function mousemove() {
		const x0 = x.invert(d3.mouse(this)[0]),
			i = bisectDate(data, x0, 1),
			d0 = data[i - 1],
			d1 = data[i],
			d = x0 - d0.date > d1.date - x0 ? d1 : d0
		focus.attr('transform', 'translate(' + x(d.date) + ',' + y(d.close) + ')')
		focus.select('text').text(d)
	}
}
