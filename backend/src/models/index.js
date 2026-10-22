import mongoose from "mongoose";

const { Schema, model } = mongoose;
const required = (type) => ({ type, required: true });
// Every model gets createdAt and updatedAt.
const withTimes = { timestamps: true };

export const Song = model(
	"Song",
	new Schema(
		{
			title: required(String),
			artist: required(String),
			imageUrl: required(String),
			audioUrl: required(String),
			duration: required(Number), // seconds
			albumId: { type: Schema.Types.ObjectId, ref: "Album" }, // unset for singles
		},
		withTimes,
	),
);

export const Album = model(
	"Album",
	new Schema(
		{
			title: required(String),
			artist: required(String),
			imageUrl: required(String),
			releaseYear: required(Number),
			songs: [{ type: Schema.Types.ObjectId, ref: "Song" }],
		},
		withTimes,
	),
);

/** People who have signed in, keyed by their Clerk id (used for the chat contact list). */
export const User = model(
	"User",
	new Schema(
		{
			clerkId: { type: String, required: true, unique: true },
			fullName: required(String),
			imageUrl: required(String),
		},
		withTimes,
	),
);

/** A chat message; sender and receiver are Clerk ids. */
export const Message = model(
	"Message",
	new Schema(
		{
			senderId: required(String),
			receiverId: required(String),
			content: required(String),
		},
		withTimes,
	),
);
