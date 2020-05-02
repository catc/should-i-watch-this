export interface ShowData {
	// Actors: "Joel McHale, Gillian Jacobs, Danny Pudi, Alison Brie"
	// Awards: "Won 1 Primetime Emmy. Another 16 wins & 69 nominations."
	// Country: "USA"
	// Director: "N/A"
	Genre: string
	// Language: "English"
	// Metascore: "N/A"
	// Plot: "A suspended lawyer is forced to enroll in a community college with an eclectic staff and student body."
	Poster: string
	// Rated: "TV-14"
	// Ratings: [{ … }]
	// Released: "17 Sep 2009"
	// Response: "True"
	// Runtime: "22 min"
	Title: string
	// Type: "series"
	// Writer: "Dan Harmon"
	Year: string
	imdbID: string
	imdbRating: string
	imdbVotes: string
	totalSeasons: number
}

interface Episode {
	Episode: number
	Released: string
	Title: string
	imdbID: string
	imdbRating: number
}

export interface Season {
	Title: string
	Season: number
	totalSeasons: number
	Episodes: Episode[]
}
