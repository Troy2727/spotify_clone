// The REST API, mounted at /api. Paths match the Vercel demo functions in /api.

import { Router } from "express";
import { uploadFile } from "./lib/cloudinary.js";
import { isAdmin, protectRoute, requireAdmin } from "./middleware/auth.middleware.js";
import { Album, Message, Song, User } from "./models/index.js";

const api = Router();

/** Let async handlers throw; Express 4 doesn't forward rejected promises on its own. */
const handle = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const notFound = (res, what) => res.status(404).json({ message: `${what} not found` });

// ---------- Catalog (public)

/** `size` random songs, for the home page rows. */
const randomSongs = (size) =>
	Song.aggregate([{ $sample: { size } }, { $project: { title: 1, artist: 1, imageUrl: 1, audioUrl: 1, duration: 1 } }]);

api.get("/songs/featured", handle(async (_req, res) => res.json(await randomSongs(6))));
api.get("/songs/made-for-you", handle(async (_req, res) => res.json(await randomSongs(4))));
api.get("/songs/trending", handle(async (_req, res) => res.json(await randomSongs(4))));

api.get("/albums", handle(async (_req, res) => res.json(await Album.find())));
api.get(
	"/albums/:albumId",
	handle(async (req, res) => {
		const album = await Album.findById(req.params.albumId).populate("songs");
		return album ? res.json(album) : notFound(res, "Album");
	}),
);

// ---------- Accounts and chat (signed in)

// Called after sign-in so the user shows up in other people's chat contacts.
api.post(
	"/auth/callback",
	protectRoute,
	handle(async (req, res) => {
		const { firstName, lastName, imageUrl } = req.body;
		// Only ever create the caller's own record, whatever id the body claims.
		await User.updateOne(
			{ clerkId: req.auth.userId },
			{ $setOnInsert: { fullName: `${firstName ?? ""} ${lastName ?? ""}`.trim() || "New listener", imageUrl } },
			{ upsert: true },
		);
		res.json({ success: true });
	}),
);

api.get("/users", protectRoute, handle(async (req, res) => res.json(await User.find({ clerkId: { $ne: req.auth.userId } }))));

api.get(
	"/users/messages/:userId",
	protectRoute,
	handle(async (req, res) => {
		const me = req.auth.userId;
		const them = req.params.userId;
		const conversation = await Message.find({
			$or: [
				{ senderId: me, receiverId: them },
				{ senderId: them, receiverId: me },
			],
		}).sort({ createdAt: 1 });
		res.json(conversation);
	}),
);

// ---------- Admin

// Any signed-in user may ask whether they're an admin; everything else below needs it.
api.get("/admin/check", protectRoute, handle(async (req, res) => res.json({ admin: await isAdmin(req.auth.userId) })));

api.get("/songs", protectRoute, requireAdmin, handle(async (_req, res) => res.json(await Song.find().sort({ createdAt: -1 }))));

api.get(
	"/stats",
	protectRoute,
	requireAdmin,
	handle(async (_req, res) => {
		const [totalSongs, totalAlbums, totalUsers, artists] = await Promise.all([
			Song.countDocuments(),
			Album.countDocuments(),
			User.countDocuments(),
			// Distinct artist names across songs and albums together
			Song.aggregate([{ $unionWith: { coll: "albums" } }, { $group: { _id: "$artist" } }, { $count: "count" }]),
		]);
		res.json({ totalSongs, totalAlbums, totalUsers, totalArtists: artists[0]?.count ?? 0 });
	}),
);

const admin = Router();
admin.use(protectRoute, requireAdmin);

admin.post(
	"/songs",
	handle(async (req, res) => {
		const { audioFile, imageFile } = req.files ?? {};
		if (!audioFile || !imageFile) return res.status(400).json({ message: "Please upload all files" });

		const { title, artist, albumId, duration } = req.body;
		const [audioUrl, imageUrl] = await Promise.all([uploadFile(audioFile), uploadFile(imageFile)]);
		const song = await Song.create({ title, artist, duration, audioUrl, imageUrl, albumId: albumId || null });
		if (albumId) await Album.findByIdAndUpdate(albumId, { $push: { songs: song._id } });
		res.status(201).json(song);
	}),
);

admin.delete(
	"/songs/:id",
	handle(async (req, res) => {
		const song = await Song.findByIdAndDelete(req.params.id);
		if (!song) return notFound(res, "Song");
		if (song.albumId) await Album.findByIdAndUpdate(song.albumId, { $pull: { songs: song._id } });
		res.json({ message: "Song deleted successfully" });
	}),
);

admin.post(
	"/albums",
	handle(async (req, res) => {
		const imageFile = req.files?.imageFile;
		if (!imageFile) return res.status(400).json({ message: "Please upload a cover image" });
		const { title, artist, releaseYear } = req.body;
		const album = await Album.create({ title, artist, releaseYear, imageUrl: await uploadFile(imageFile) });
		res.status(201).json(album);
	}),
);

// Deleting an album deletes its songs too.
admin.delete(
	"/albums/:id",
	handle(async (req, res) => {
		await Song.deleteMany({ albumId: req.params.id });
		await Album.findByIdAndDelete(req.params.id);
		res.json({ message: "Album deleted successfully" });
	}),
);

api.use("/admin", admin);

export default api;
