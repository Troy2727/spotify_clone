import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (server) => {
	// Allow connections from localhost and Vercel deployment
	const allowedOrigins = [
		"http://localhost:3000",
		"http://localhost:3001",
		"http://localhost:5173", // Vite default dev port
		process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
		process.env.FRONTEND_URL || null
	].filter(Boolean); // Remove null values

	console.log("Allowed origins for socket.io:", allowedOrigins);

	// In development, allow all origins
	const corsConfig = process.env.NODE_ENV === 'production'
		? { origin: allowedOrigins.length > 0 ? allowedOrigins : "*", credentials: true }
		: { origin: "*", credentials: true };

	console.log("Socket.io CORS config:", corsConfig);

	const io = new Server(server, {
		cors: corsConfig,
		path: '/socket.io',
	});

	console.log("Socket.IO server initialized with CORS origins:", allowedOrigins);

	const userSockets = new Map(); // { userId: socketId}
	const userActivities = new Map(); // {userId: activity}

	io.on("connection", (socket) => {
		console.log("New socket connection established:", socket.id);

		socket.on("user_connected", (userId) => {
			console.log("User connected event received:", userId);
			userSockets.set(userId, socket.id);
			userActivities.set(userId, "Idle");

			console.log("Current connected users:", Array.from(userSockets.keys()));

			// broadcast to all connected sockets that this user just logged in
			io.emit("user_connected", userId);

			socket.emit("users_online", Array.from(userSockets.keys()));

			io.emit("activities", Array.from(userActivities.entries()));
		});

		socket.on("update_activity", ({ userId, activity }) => {
			console.log("activity updated", userId, activity);
			userActivities.set(userId, activity);
			io.emit("activity_updated", { userId, activity });
		});

		socket.on("send_message", async (data) => {
			console.log("Received send_message event:", data);
			try {
				const { senderId, receiverId, content } = data;
				console.log("Creating message in database:", { senderId, receiverId, content });

				const message = await Message.create({
					senderId,
					receiverId,
					content,
				});
				console.log("Message created successfully:", message);

				// send to receiver in realtime, if they're online
				const receiverSocketId = userSockets.get(receiverId);
				console.log("Receiver socket ID:", receiverSocketId);

				if (receiverSocketId) {
					console.log("Emitting receive_message to receiver:", receiverId);
					io.to(receiverSocketId).emit("receive_message", message);
				} else {
					console.log("Receiver not online, message will be delivered when they connect");
				}

				console.log("Emitting message_sent to sender");
				socket.emit("message_sent", message);
			} catch (error) {
				console.error("Message error:", error);
				socket.emit("message_error", error.message);
			}
		});

		socket.on("disconnect", () => {
			let disconnectedUserId;
			for (const [userId, socketId] of userSockets.entries()) {
				// find disconnected user
				if (socketId === socket.id) {
					disconnectedUserId = userId;
					userSockets.delete(userId);
					userActivities.delete(userId);
					break;
				}
			}
			if (disconnectedUserId) {
				io.emit("user_disconnected", disconnectedUserId);
			}
		});
	});
};
