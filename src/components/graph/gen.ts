import * as d3 from 'd3'
import flatten from 'lodash/flatten'
import flatMap from 'lodash/flatMap'
import { Season, Episode } from '../../utils/types'
import { getColor, calcChartValues } from './utils'
import { createXAxisTicks, createXAxisText, createXAxisLine } from './x-axis'
import { ANIMATE_AXIS_DURATION } from './constants'
import Pan from './pan'
import { createMainContent } from './main-content'

window.d3 = d3 // FOR TESTING

export function setupChart(ref: HTMLElement, seasons: Season[]) {
	const episodes = flatMap(seasons, season => {
		season.Episodes.forEach(e => (e.Season = season.Season))
		return season.Episodes
	})

	const { width: CHART_WIDTH, height: CHART_HEIGHT } = ref.getBoundingClientRect()

	const svgYAxis = d3
		.select(ref)
		.append('svg')
		.attr('id', 'y-axis-svg')
		.attr('width', 1)
		.attr('height', CHART_HEIGHT)

	const svgMainContent = d3
		.select(ref)
		.append('svg')
		.attr('id', 'content-svg')
		.attr('width', CHART_WIDTH)
		.attr('height', CHART_HEIGHT + 50)

	const VALUES = calcChartValues(CHART_WIDTH, seasons, episodes.length)
	const { TOTAL_WIDTH } = VALUES

	//  ---------------------------------------

	// y scale
	const yScale = d3.scaleLinear().domain([0, 10]).range([CHART_HEIGHT, 0])
	svgYAxis.append('g').attr('id', 'y-axis').call(d3.axisLeft(yScale))

	// x axis
	const contentg = svgMainContent.append('g').attr('id', 'content')

	const xaxis = contentg
		.append('g')
		.attr('transform', 'translate(0,' + CHART_HEIGHT + ')')
		.attr('id', 'x-axis')

	// create
	const xAxisLine = createXAxisLine(xaxis)
	const xAxisText = createXAxisText(xaxis)
	const xAxisTicks = createXAxisTicks(xaxis)
	const content = createMainContent(contentg, yScale)

	// draw
	xAxisLine.generate(VALUES)
	xAxisText.generate(VALUES, seasons)
	xAxisTicks.generate(VALUES, CHART_HEIGHT)
	content.generate(VALUES, seasons, episodes)

	// TODO - clean this up
	const drag = new Pan(svgMainContent, TOTAL_WIDTH)
	window.d = drag

	return Object.assign(svgYAxis.node(), {
		async update(seasons: Season[]) {
			const episodes = flatMap(seasons, season => {
				season.Episodes.forEach(e => (e.Season = season.Season))
				return season.Episodes
			})

			const t = svgMainContent.transition().duration(ANIMATE_AXIS_DURATION)
			const VALUES = calcChartValues(CHART_WIDTH, seasons, episodes.length)

			// update
			xAxisLine.update(VALUES, t)
			xAxisText.update(VALUES, CHART_HEIGHT, seasons, t)
			xAxisTicks.update(VALUES, CHART_HEIGHT, t)
			content.update(VALUES, seasons, episodes)

			drag.reset()
		},
	})
}
