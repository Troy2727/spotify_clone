// API shapes. Ids are MongoDB ObjectIds as strings (mock ids on the Vercel demo).

export interface Song {
	_id: string;
	title: string;
	artist: string;
	/** null for singles that aren't on an album */
	albumId: string | null;
	imageUrl: string;
	audioUrl: string;
	/** seconds */
	duration: number;
	createdAt: string;
	updatedAt: string;
}

export interface Album {
	_id: string;
	title: string;
	artist: string;
	imageUrl: string;
	releaseYear: number;
	songs: Song[];
}

/** Admin dashboard counters */
export interface Stats {
	totalSongs: number;
	totalAlbums: number;
	totalUsers: number;
	totalArtists: number;
}

/** A chat message; sender and receiver are Clerk user ids. */
export interface Message {
	_id: string;
	senderId: string;
	receiverId: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

/** Someone you can chat with (our users collection, keyed by their Clerk id). */
export interface User {
	_id: string;
	clerkId: string;
	fullName: string;
	imageUrl: string;
}
