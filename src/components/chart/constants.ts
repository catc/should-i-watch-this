import { Season, Episode } from '../../utils/types'

export type SeasonSelectionType = d3.Selection<any, Season, SVGElement, any>
export type EpisodeSelectionType = d3.Selection<any, Episode, SVGElement, any>
export type RangeSelectionType = d3.Selection<any, number, SVGElement, any>
export type TransitionType = d3.Transition<SVGSVGElement, unknown, null, undefined>
export type D3Selection = d3.Selection<SVGGElement, unknown, null, undefined>
export type SvgSelection = d3.Selection<SVGSVGElement, unknown, null, undefined>
export type DivSelection = d3.Selection<HTMLDivElement, unknown, null, undefined>

export const DOT_SIZE = 5
export const MIN_SPACING = 10 // min spacing between dots
export const PADDING = 20 // left and right padding of line

export const ANIMATE_AXIS_DURATION = 750
export const ANIMATE_CONTENT_DURATION = 1200
// export const ANIMATE_CONTENT_DURATION = 180

export const CONTENT_ID = '#content'
