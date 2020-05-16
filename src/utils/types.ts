export interface ShowData {
	Genre: string
	Plot: string
	Poster: string
	Title: string
	Year: string
	imdbID: string
	imdbRating: string
	imdbVotes: string
	totalSeasons: number
}

export interface Episode {
	seriesID: string
	episodeID: string
	season: number
	episode: number
	seriesTitle: string
	episodeTitle: string
	rating: number
	votes: number
}

export interface Season {
	seriesTitle: string
	season: number
	episodes: Episode[]
}
