// Local development server: the REST API, chat over Socket.IO, and (with
// NODE_ENV=production) the built frontend. The live demo uses /api on Vercel instead.

import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import fs from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import cron from "node-cron";
import api from "./api.js";
import { connectDB } from "./lib/db.js";
import { allowedOrigin } from "./lib/origins.js";
import { initializeSocket } from "./lib/socket.js";
import { User } from "./models/index.js";

const ROOT = path.resolve(); // the backend folder (npm scripts run here)
const UPLOADS = path.join(ROOT, "tmp");

const app = express();
const server = createServer(app);
initializeSocket(server);

app.use(cors({ origin: allowedOrigin(), credentials: true }));
app.use(express.json());
app.use(clerkMiddleware()); // sets req.auth from the Clerk session token
app.use(fileUpload({ useTempFiles: true, tempFileDir: UPLOADS, createParentPath: true, limits: { fileSize: 10 * 1024 * 1024 } }));
app.use("/api", api);

if (process.env.NODE_ENV === "production") {
	const dist = path.join(ROOT, "../frontend/dist");
	app.use(express.static(dist));
	app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

// eslint-disable-next-line no-unused-vars -- Express recognises error handlers by their 4 arguments
app.use((err, _req, res, _next) => {
	console.error(err);
	res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
});

// Uploads go to Cloudinary; the temp copies are cleared every hour.
cron.schedule("0 * * * *", async () => {
	const files = await fs.readdir(UPLOADS).catch(() => []);
	await Promise.all(files.map((file) => fs.unlink(path.join(UPLOADS, file)).catch(() => {})));
});

/** Two contacts so chat has someone to talk to on a fresh database. */
async function ensureChatTestUsers() {
	for (const n of [1, 2]) {
		await User.updateOne(
			{ clerkId: `test_user_${n}` },
			{ $setOnInsert: { fullName: `Test User ${n}`, imageUrl: "https://via.placeholder.com/150" } },
			{ upsert: true },
		);
	}
}

/** Listen on PORT (default 5000), moving to the next port if it's taken. */
function listen(port) {
	server
		.once("error", (error) => {
			if (error.code !== "EADDRINUSE") throw error;
			console.log(`Port ${port} is busy, trying ${port + 1}`);
			listen(port + 1);
		})
		.listen(port, () => console.log(`API listening on http://localhost:${port}`));
}

await connectDB();
await ensureChatTestUsers().catch((error) => console.error("Could not create chat test users:", error.message));
listen(Number(process.env.PORT) || 5000);
