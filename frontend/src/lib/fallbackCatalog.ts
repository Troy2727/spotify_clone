import { Album, Song } from "@/types";

// Shown if the API can't be reached, so the home page and sidebar never render empty.
// Covers and audio are the files in public/.

const NOW = new Date().toISOString();

/** [id, title, artist, cover number, audio number, seconds] */
type Row = [string, string, string, number, number, number];

const toSongs = (rows: Row[]): Song[] =>
	rows.map(([_id, title, artist, cover, audio, duration]) => ({
		_id,
		title,
		artist,
		imageUrl: `/cover-images/${cover}.jpg`,
		audioUrl: `/songs/${audio}.mp3`,
		duration,
		albumId: null,
		createdAt: NOW,
		updatedAt: NOW,
	}));

export const FALLBACK_FEATURED = toSongs([
	["featured1", "Believer", "Imagine Dragons", 17, 1, 180],
	["featured2", "Burn", "Usher", 15, 2, 210],
	["featured3", "Uprising", "Muse", 3, 3, 195],
	["featured4", "New Americana", "Halsey", 5, 4, 225],
	["featured5", "Dancing Queen", "ABBA", 14, 5, 240],
	["featured6", "Venom", "Eminem", 9, 6, 200],
]);

export const FALLBACK_MADE_FOR_YOU = toSongs([
	["mfy1", "Starboy", "The Weeknd", 16, 7, 230],
	["mfy2", "Enemy", "Imagine Dragons & JID", 1, 8, 215],
	["mfy3", "Yeah!", "Usher", 15, 9, 250],
	["mfy4", "Shape of You", "Ed Sheeran", 4, 10, 235],
]);

export const FALLBACK_TRENDING = toSongs([
	["trending1", "Treat You Better", "Shawn Mendes", 10, 1, 240],
	["trending2", "Happier Than Ever", "Billie Eilish", 11, 2, 195],
	["trending3", "The Hills", "The Weeknd", 12, 3, 210],
	["trending4", "The Best", "AWOLNATION", 13, 4, 225],
]);

export const FALLBACK_ALBUMS: Album[] = (
	[
		["album1", "Confessions", "Usher", 15, 2004],
		["album2", "Kamikaze", "Eminem", 9, 2018],
		["album3", "Illuminate", "Shawn Mendes", 10, 2016],
		["album4", "The Resistance", "Muse", 3, 2009],
	] as const
).map(([_id, title, artist, cover, releaseYear]) => ({
	_id,
	title,
	artist,
	imageUrl: `/cover-images/${cover}.jpg`,
	releaseYear,
	songs: [],
}));
