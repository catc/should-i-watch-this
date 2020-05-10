import * as d3 from 'd3'
import flatten from 'lodash/flatten'
import flatMap from 'lodash/flatMap'
import { Season, Episode } from '../../utils/types'
import { getColor, calcChartValues } from './utils'
import { createXAxisTicks, createXAxisText, createXAxisLine } from './x-axis'
import { ANIMATE_AXIS_DURATION } from './constants'
import Pan from './pan'
import { createMainContent } from './main-content'
import { createYAxis } from './y-axis'

window.d3 = d3 // FOR TESTING

export function setupChart(ref: HTMLElement, seasons: Season[]) {
	const episodes = flatMap(seasons, season => {
		season.Episodes.forEach(e => (e.Season = season.Season))
		return season.Episodes
	})

	// TODO - add resize support
	const { width: CHART_WIDTH, height: CHART_HEIGHT } = ref.getBoundingClientRect()

	const svgYAxis = d3
		.select(ref)
		.append('svg')
		.attr('id', 'y-axis-svg')
		.attr('width', 1)
		.attr('height', CHART_HEIGHT)

	const svgContent = d3
		.select(ref)
		.append('svg')
		.attr('id', 'content-svg')
		.attr('width', CHART_WIDTH)
		.attr('height', CHART_HEIGHT + 50)

	//  ---------------------------------------

	const VALUES = calcChartValues(CHART_WIDTH, seasons, episodes.length)
	const { TOTAL_WIDTH } = VALUES

	// x axis + content wrapper
	const contentGroup = svgContent.append('g').attr('id', 'content')

	// x axis
	const xaxis = contentGroup
		.append('g')
		.attr('transform', `translate(0, ${CHART_HEIGHT})`)
		.attr('id', 'x-axis')

	// create chart elements
	const { yScale } = createYAxis(svgYAxis, CHART_HEIGHT, VALUES)
	const xAxisLine = createXAxisLine(xaxis)
	const xAxisText = createXAxisText(xaxis)
	const xAxisTicks = createXAxisTicks(xaxis)
	const mainContent = createMainContent(contentGroup, yScale)

	// draw chart
	xAxisLine.generate(VALUES)
	xAxisText.generate(VALUES, seasons)
	xAxisTicks.generate(VALUES, CHART_HEIGHT)
	mainContent.generate(VALUES, seasons, episodes)

	// TODO - clean this up
	const drag = new Pan(svgContent, TOTAL_WIDTH)
	window.d = drag

	return {
		async update(seasons: Season[]) {
			const episodes = flatMap(seasons, season => {
				season.Episodes.forEach(e => (e.Season = season.Season))
				return season.Episodes
			})

			const t = svgContent.transition().duration(ANIMATE_AXIS_DURATION)
			const VALUES = calcChartValues(CHART_WIDTH, seasons, episodes.length)

			// update chart
			xAxisLine.update(VALUES, t)
			xAxisText.update(VALUES, CHART_HEIGHT, seasons, t)
			xAxisTicks.update(VALUES, CHART_HEIGHT, t)
			mainContent.update(VALUES, seasons, episodes)

			drag.reset()
		},
	}
}