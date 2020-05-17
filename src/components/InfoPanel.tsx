import React from 'react'
import useAppState from '../hooks/useAppState'
import { hasPoster } from './utils/poster'

/*
	features:
	- name + year
	- link + rating
	- genres
	- best season
	- trend
		- starts strong, doing worse recently
	- worth watching?
		- if over 8 average?
		- if last 2 seasons average at least 7.5? if at least x seasons?
	- options:
		- show show average
		- display episode indicator/line
*/

const link = (id: string) => ({
	href: `https://www.imdb.com/title/${id}`,
	target: '_blank',
	rel: 'noopener noreferrer',
})

export default function InfoPanel() {
	const { selectedShow } = useAppState()
	const { info, seasons } = selectedShow!

	return (
		<div className="info-panel">
			<div className="info-panel__left">
				<a {...link(info.imdbID)} className="info-panel__poster">
					{hasPoster(info.Poster) ? (
						<img src={info.Poster} alt="poster" />
					) : null}
				</a>

				<div className="info-panel__rating">
					{info.imdbRating} <span>/ 10</span>
				</div>
			</div>
			<div className="info-panel__right">
				<a {...link(info.imdbID)} className="info-panel__title">
					{info.Title} <span>({info.Year})</span>
				</a>
				<div className="info-panel__genre">{info.Genre}</div>
				<div className="info-panel__plot">{info.Plot}</div>
				<div className="info-panel__seasons">
					{seasons.length} season{seasons.length === 1 ? '' : 's'}
				</div>
			</div>
		</div>
	)
}
