import * as d3 from 'd3'
import { parseSvg } from 'd3-interpolate/src/transform/parse'
import { CONTENT_ID, D3Selection } from './constants'
import { ChartValues } from './utils'
import { createTooltip } from './tooltip'
import { Episode } from '../../utils/types'

const FADE_WIDTH = 100
const LEFT_FADE_GRADIENT_ID = 'left-fade-gradient'
const RIGHT_FADE_GRADIENT_ID = 'right-fade-gradient'
const FADE_BUFFER = 50

function createGradient(defs: any, id: string, colors: [number, string, number][]) {
	const gradient = defs.append('linearGradient').attr('id', id)

	gradient.attr('x1', '0%').attr('x2', '100%').attr('y1', '0%').attr('y2', '0%')

	gradient
		.selectAll('stop')
		.data(colors)
		.enter()
		.append('stop')
		.attr('offset', data => `${data[0]}%`)
		.attr('stop-color', data => data[1])
		.attr('stop-opacity', data => data[2])

	return gradient
}

function createGradientFades(svg: D3Selection, chartHeight: number) {
	const svgWidth = parseInt(svg.attr('width'), 10)
	const defs = svg.append('defs')

	createGradient(defs, LEFT_FADE_GRADIENT_ID, [
		[0, 'white', 1],
		[20, 'white', 1],
		[100, 'white', 0],
	])
	createGradient(defs, RIGHT_FADE_GRADIENT_ID, [
		[0, 'white', 0],
		[80, 'white', 1],
		[100, 'white', 1],
	])

	const leftFade = svg
		.append('rect')
		.attr('class', 'fade-rect right')
		.attr('x', -FADE_WIDTH)
		.attr('y', 0)
		.attr('width', FADE_WIDTH)
		.attr('height', chartHeight)
		.style('fill', `url(#${LEFT_FADE_GRADIENT_ID})`)

	const rightFade = svg
		.append('rect')
		.attr('class', 'fade-rect right')
		.attr('x', svgWidth)
		.attr('y', 0)
		.attr('width', FADE_WIDTH)
		.attr('height', chartHeight)
		.style('fill', `url(#${RIGHT_FADE_GRADIENT_ID})`)

	return {
		displayLeftFade(display: boolean) {
			if (display) {
				leftFade.transition().duration(500).attr('x', 0)
			} else {
				leftFade.transition().duration(500).attr('x', -FADE_WIDTH)
			}
		},
		displayRightFade(display: boolean) {
			if (display) {
				rightFade
					.transition()
					.duration(500)
					.attr('x', svgWidth - FADE_WIDTH)
			} else {
				rightFade.transition().duration(500).attr('x', svgWidth)
			}
		},
	}
}

export default function createPan(svg: any, chartHeight: number, values: ChartValues) {
	const content = svg.select(CONTENT_ID)

	const { displayRightFade, displayLeftFade } = createGradientFades(svg, chartHeight)

	const drag = d3.drag()
	const zoom = d3.zoom()

	initDrag(values)

	function initDrag(values: ChartValues) {
		const { TOTAL_WIDTH } = values
		const svgWidth = parseInt(svg.attr('width'), 10)

		// account for minor discrepancies in width
		const chartExtends = Math.abs(svgWidth - TOTAL_WIDTH) > 15
		const scale = chartExtends ? TOTAL_WIDTH / svgWidth + 1 : 1
		zoom.scaleExtent([1, scale])
			.translateExtent([
				[0, 0],
				[chartExtends ? TOTAL_WIDTH : svgWidth, 0],
			])
			.on('zoom', zoomed)

		drag.on('start', dragstarted).on('drag', dragged).on('end', dragended)
		svg.call(drag)
		svg.call(zoom).on('wheel', () => {
			d3.event.preventDefault()
		})

		updateFade(0, true)

		// used to determine how far left/right panning from initial start point
		let pointerStart = 0
		function dragstarted() {
			svg.attr('cursor', 'grabbing')
			d3.select(this).raise()

			pointerStart = d3.event.x
		}

		function dragged() {
			const delta = pointerStart - d3.event.x
			const x = -delta
			pointerStart = d3.event.x
			zoom.translateBy(svg, x, 0)
		}

		function dragended() {
			svg.attr('cursor', '')
		}

		function zoomed() {
			const x = Math.min(Math.max(d3.event.transform.x, svgWidth - TOTAL_WIDTH), 0)
			content.attr('transform', `translate(${x})`)

			updateFade(x)
		}

		function updateFade(x: number, override?: boolean) {
			if (chartExtends || override) {
				const translatedX = Math.abs(x)
				const showRight = translatedX + svgWidth + FADE_BUFFER < TOTAL_WIDTH
				displayRightFade(showRight)
				const showLeft = translatedX > FADE_BUFFER
				displayLeftFade(showLeft)
			}
		}
	}

	return {
		async reset(values: ChartValues) {
			// if scrolled, reset to 0
			const translatedX = getTranslateX(content)
			if (translatedX) {
				await svg
					.transition()
					.duration(300)
					.call(zoom.translateBy, -translatedX, 0)
					.end()
			}

			// remove event listeners
			drag.on('start', null).on('drag', null).on('end', null)
			svg.on('wheel', null)

			// reset transform
			content.attr('transform', `translate(0)`)

			// re-add listeners
			initDrag(values)
		},
	}
}

function getTranslateX(selection: any) {
	return parseSvg(selection.attr('transform')).translateX
}
