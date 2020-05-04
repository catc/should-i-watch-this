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
	Episode: number
	Released: string
	Title: string
	imdbID: string
	imdbRating: number
	Season: number // manually added
}

export interface Season {
	Title: string
	Season: number
	totalSeasons: number
	Episodes: Episode[]
}
