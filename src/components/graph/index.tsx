import React, { useEffect, useRef } from 'react'
import useAppState from '../../hooks/useAppState'

import flatten from 'lodash/flatten'
import flatMap from 'lodash/flatMap'
import * as d3 from 'd3'
import { Season } from '../../utils/types'
// import { create } from 'd3-selection'
import mock1 from './mock/mock1'

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

const MIN_SPACING = 15
const DOT_SIZE = 5
const SIZE = DOT_SIZE + MIN_SPACING

function setupChart(ref, seasons: Season[]) {
	const data = flatMap(seasons, season => {
		season.Episodes.forEach(e => (e.Season = season.Season))
		return season.Episodes
	})

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

	const MIN_WIDTH = Math.max(width, data.length * (MIN_SPACING + DOT_SIZE))

	// get extents and range
	const xExtent = d3.extent(data, (d, i) => {
		return i
	})
	const xRange = xExtent[1] - xExtent[0]

	// yExtent = d3.extent(data, d => {
	// 	return d.imdbRating
	// }),
	// yRange = yExtent[1] - yExtent[0]

	// set domain to be extent +- 5%
	// x.domain([xExtent[0] - (xRange * .05), xExtent[1] + (xRange * .05)]);
	// y.domain([yExtent[0] - (yRange * .05), yExtent[1] + (yRange * .05)]);

	const xscale2 = d3
		.scaleOrdinal()
		// .scaleBand()
		.domain([...seasons].map(season => String(season.Season)))
		// .range([0, MIN_WIDTH]) //  TODO - set min width
		// .range(seasons.map((season, i) => season.Episodes.length * SIZE))
		.range(
			[0, 10, 14, 24].map(a => a * SIZE),
			// [0, 10, 14, 24, 29].map(a => a * SIZE),
			// seasons.reduce((acc, season, i) => {
			// 	const size = season.Episodes.length * SIZE
			// 	if (!acc.length) {
			// 		acc.push(0)
			// 	} else {
			// 		const prev = acc[i - 1]
			// 		acc.push(prev + size)
			// 	}
			// 	// if (i > 0) {
			// 	// 	const prev = acc[i - 1]
			// 	// 	acc.push(prev + size)
			// 	// } else {
			// 	// }
			// 	return acc
			// }, []),
		)

	// .range([50, 100, 400, 50])
	// .range(seasons.reduce((obj, ) => {}, []))
	// ((season, i) => season.Episodes.length * 100))

	// console.log(xscale2('1'))
	// console.log(xscale2('2'))
	// console.log(xscale2('3'))
	// console.log(xscale2('4'))
	// console.log(seasons.map((season, i) => season.Episodes.length * SIZE))
	console.log(xscale2.range())
	console.log(xscale2.domain())
	// console.log(xscale2.bandwidth(3))
	// xscale2.forEach(s => console.log(s.band))

	// x axis lines
	svg.append('g')
		.attr('class', 'x-divider-lines')
		.selectAll('line.season')
		// lines
		.data(seasons.filter((_, i) => i !== 0))
		.join('line')
		.attr('class', 'foo')
		.attr('y1', 0)
		.attr('y2', height)
		.attr('x1', (d, i) => xscale2(d.Season))
		.attr('x2', (d, i) => xscale2(d.Season))
		.attr('stroke', '#222')
		.attr('stroke-width', 1)

	// .attr('height', height)
	// .attr('transform', (d, i) => {
	// 	return `translate(${50}, ${height})`
	// })

	// .step()
	// .step([100, 100, 100, 100, 100, 100])
	// .range(config.range)
	// .paddingInner(paddingInner)
	// .paddingOuter(paddingOuter)
	// .align(config.align)
	// .round(config.round)

	const xScale = d3
		.scaleLinear()
		.domain([0, data.length - 1]) // input
		.range([0, width]) //  TODO - set min width
		.domain([xExtent[0] - xRange * 0.02, data.length - 1])

	const X_SCALE_FIN = xscale2 // TODO - rename
	// const X_SCALE_FIN = xScale // TODO - rename

	// 6. Y scale will use the randomly generate number
	const yScale = d3
		.scaleLinear()
		.domain([0, 10]) // input
		.range([height, 0]) // output

	const RANGE = X_SCALE_FIN.range()
	main.append('g') // X AXIS
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + height + ')')
		.call(
			d3
				.axisBottom(X_SCALE_FIN)
				.tickSizeInner(0)
				.tickPadding(10)
				// .tickValues(a => console.log('a is', a))
				.tickFormat(seasonNumber => `Season ${seasonNumber}`),
		)
		.selectAll('text')
		.attr('x', (seasonNumber, i, nodes) => {
			// const bandWidth = i
			// console.log('d and i', seasonNumber, i, nodes)
			// console.log(RANGE)
		})
	// <div className=""></div>

	// 4. Call the y axis in a group tag
	svg.append('g').attr('class', 'y axis').call(d3.axisLeft(yScale)) // Create an axis component with d3.axisLeft

	const getx = (d, i) => {
		const key = `Season ${d.Season}`
		// const key = d.Season
		// console.log(X_SCALE_FIN(key), d.Episode * (DOT_SIZE + MIN_SPACING))
		// return X_SCALE_FIN(i)
		return X_SCALE_FIN(key) + (d.Episode - 1) * (DOT_SIZE + MIN_SPACING)
		// return X_SCALE_FIN(i)
	}
	const gety = d => yScale(d.imdbRating)

	main.selectAll('.dot')
		.data(data)
		.enter()
		.append('circle') // Uses the enter().append() method
		.attr('class', 'dot') // Assign a class for styling
		.attr('cx', getx)
		.attr('cy', gety)
		.attr('r', DOT_SIZE)
		.attr('fill', episode => {
			// console.log(a)
			return getColor(episode.Season)
		})

	const line = d3 // LINE CONNECTING DOTS
		.line()
		// LEFT OFF HERE...
		.x(getx) // set the x values for the line generator
		.y(gety)
		.curve(d3.curveMonotoneX) // apply smoothing to the line

	// TODO - reenable line
	main.append('path')
		.datum(data) // 10. Binds data to the line
		.attr('class', 'line') // Assign a class for styling
		.attr('d', line) // 11. Calls the line generator

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
