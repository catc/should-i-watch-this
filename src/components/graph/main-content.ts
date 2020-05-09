import * as d3 from 'd3'
import { ChartValues, getColor } from './utils'
import { Season, Episode } from '../../utils/types'
import {
	D3Selection,
	DOT_SIZE,
	EpisodeSelectionType,
	ANIMATE_CONTENT_DURATION,
	ANIMATE_AXIS_DURATION,
} from './constants'

function getXY(xScale: any, yScale: any, size: number) {
	return {
		getx: (episode: Episode) => {
			return xScale(String(episode.Season)) + (episode.Episode - 1) * size
		},
		gety: (episode: Episode) => yScale(episode.imdbRating),
	}
}

function generateLine(getx: any, gety: any, episodes: Episode[]) {
	return d3.line().x(getx).y(gety).curve(d3.curveMonotoneX)(episodes as any)
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

export function createMainContent(
	container: D3Selection,
	yScale: d3.ScaleLinear<number, number>,
) {
	const group = container.append('g').attr('id', 'main')
	const linepath = group.append('path').attr('class', 'dot-line')
	const xScale = d3.scaleOrdinal()

	async function animate(values: ChartValues, seasons: Season[], episodes: Episode[]) {
		const t = container.transition().duration(750)
		const { RANGES_NORMALIZED_NO_LAST, SIZE } = values

		xScale
			.domain(seasons.map(season => String(season.Season)))
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
			.style('opacity', 1)
			// draw in
			.transition()
			.duration(ANIMATE_CONTENT_DURATION)
			.ease(d3.easeLinear)
			.attr('stroke-dashoffset', 0)

		// animate dots
		const totalepisodes = episodes.length
		group
			.selectAll<any, Episode>('.dot')
			.data(episodes, (episode: Episode) => String(episode.Episode))
			.join(enter => enter.append('circle').call(addDots))
			.call(positionDots, getx, gety)
			.style('opacity', 0)
			// fade in
			.transition()
			.duration(ANIMATE_CONTENT_DURATION / 10)
			.ease(d3.easeLinear)
			.delay((_, i) => (ANIMATE_CONTENT_DURATION / totalepisodes) * (i + 2))
			.style('opacity', 1)
	}

	return {
		async generate(values: ChartValues, seasons: Season[], episodes: Episode[]) {
			await animate(values, seasons, episodes)
		},
		async update(values: ChartValues, seasons: Season[], episodes: Episode[]) {
			const t = container.transition().duration(ANIMATE_AXIS_DURATION) // TODO - used on group now instead of svg - ensure it works

			// hide line
			const linecomplete = linepath.transition(t).style('opacity', 0).end()
			// hide dots
			group.selectAll('.dot').transition(t).style('opacity', 0)

			await linecomplete
			await animate(values, seasons, episodes)
		},
	}
}
