import express from "express";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "path";
import cors from "cors";
import fs from "fs";
import { createServer } from "http";
import cron from "node-cron";

import { initializeSocket } from "./lib/socket.js";

import { connectDB } from "./lib/db.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import authRoutes from "./routes/auth.route.js";
import songRoutes from "./routes/song.route.js";
import albumRoutes from "./routes/album.route.js";
import statRoutes from "./routes/stat.route.js";
import { User } from "./models/user.model.js";

dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT;

const httpServer = createServer(app);
initializeSocket(httpServer);

// Configure CORS to allow requests from both localhost and Vercel deployment
const allowedOrigins = [
	"http://localhost:3000",
	"http://localhost:3001",
	"http://localhost:5173", // Vite default dev port
	process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
	process.env.FRONTEND_URL || null
].filter(Boolean); // Remove null values

console.log("Allowed CORS origins:", allowedOrigins);

// In development, allow all origins
if (process.env.NODE_ENV === 'development') {
	app.use(cors());
	console.log("CORS: Allowing all origins in development mode");
} else {
	app.use(
		cors({
			origin: function(origin, callback) {
				// Allow requests with no origin (like mobile apps, curl, etc.)
				if (!origin) return callback(null, true);

				if (allowedOrigins.length === 0 || allowedOrigins.indexOf(origin) !== -1) {
					callback(null, true);
				} else {
					console.log("Blocked by CORS:", origin);
					// In production, be more strict about origins
					callback(new Error('Not allowed by CORS'));
				}
			},
			credentials: true,
		})
	);
}

app.use(express.json()); // to parse req.body
app.use(clerkMiddleware()); // this will add auth to req obj => req.auth
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: path.join(__dirname, "tmp"),
		createParentPath: true,
		limits: {
			fileSize: 10 * 1024 * 1024, // 10MB  max file size
		},
	})
);

// cron jobs
const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
	if (fs.existsSync(tempDir)) {
		fs.readdir(tempDir, (err, files) => {
			if (err) {
				console.log("error", err);
				return;
			}
			for (const file of files) {
				fs.unlink(path.join(tempDir, file), (err) => {});
			}
		});
	}
});

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/stats", statRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
	});
}

// error handler
app.use((err, req, res, next) => {
	res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
});

// Connect to MongoDB when the app starts
connectDB().then(async () => {
	// Create test users for chat functionality
	try {
		// Check if test users already exist
		const testUser1 = await User.findOne({ clerkId: 'test_user_1' });
		const testUser2 = await User.findOne({ clerkId: 'test_user_2' });

		if (!testUser1) {
			console.log("Creating test user 1...");
			await User.create({
				clerkId: 'test_user_1',
				fullName: 'Test User 1',
				imageUrl: 'https://via.placeholder.com/150'
			});
			console.log("Test user 1 created successfully");
		}

		if (!testUser2) {
			console.log("Creating test user 2...");
			await User.create({
				clerkId: 'test_user_2',
				fullName: 'Test User 2',
				imageUrl: 'https://via.placeholder.com/150'
			});
			console.log("Test user 2 created successfully");
		}
	} catch (error) {
		console.error("Error creating test users:", error);
	}
});

// Start the server with fallback ports if the primary port is in use
const startServer = (port) => {
	httpServer.listen(port)
		.on('listening', () => {
			console.log(`Server is running on port ${port}`);
		})
		.on('error', (err) => {
			if (err.code === 'EADDRINUSE') {
				console.log(`Port ${port} is busy, trying port ${port + 1}`);
				startServer(port + 1);
			} else {
				console.error('Server error:', err);
			}
		});
};

// Try to start on the configured port
startServer(parseInt(PORT || 5000, 10));
