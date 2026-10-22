// Fill the local database with the same catalog the live demo serves (api/),
// so local development and the demo look alike. Replaces all songs and albums.
//
//   npm run seed

import "dotenv/config";
import mongoose from "mongoose";
import { albums } from "../../api/albums.js";
import { featuredSongs } from "../../api/songs/featured.js";
import { madeForYouSongs } from "../../api/songs/made-for-you.js";
import { trendingSongs } from "../../api/songs/trending.js";
import { Album, Song } from "./models/index.js";

const songFields = ({ title, artist, imageUrl, audioUrl, duration }) => ({ title, artist, imageUrl, audioUrl, duration });

async function seed() {
	await mongoose.connect(process.env.MONGODB_URI);
	await Promise.all([Song.deleteMany({}), Album.deleteMany({})]);

	// Singles appear in several demo lists; insert each title once.
	const singles = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
	const unique = [...new Map(singles.map((song) => [`${song.title}|${song.artist}`, song])).values()];
	await Song.insertMany(unique.map(songFields));

	for (const { title, artist, imageUrl, releaseYear, songs } of albums) {
		const album = await Album.create({ title, artist, imageUrl, releaseYear });
		const tracks = await Song.insertMany(songs.map((song) => ({ ...songFields(song), albumId: album._id })));
		album.songs = tracks.map((track) => track._id);
		await album.save();
	}

	console.log(`Seeded ${await Song.countDocuments()} songs and ${await Album.countDocuments()} albums.`);
}

seed()
	.catch((error) => {
		console.error("Seeding failed:", error);
		process.exitCode = 1;
	})
	.finally(() => mongoose.disconnect());
