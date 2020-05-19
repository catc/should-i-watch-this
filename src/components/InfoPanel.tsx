import React, { memo } from 'react'
import { hasPoster } from './utils/poster'
import Analysis, { ToggleTrendlineFn } from './Analysis'
import { Show } from '../utils/cache'

const link = (id: string) => ({
	href: `https://www.imdb.com/title/${id}`,
	target: '_blank',
	rel: 'noopener noreferrer',
})

type Props = {
	toggleTrendline: ToggleTrendlineFn
	show: Show
}

function InfoPanel({ toggleTrendline, show }: Props) {
	const { info, seasons } = show

	return (
		<div className="panel">
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

			<Analysis show={show} toggleTrendline={toggleTrendline} />
		</div>
	)
}

export default memo(InfoPanel)
