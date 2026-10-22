// Real-time chat and "what friends are listening to" over Socket.IO.
//
// Client -> server: user_connected(userId), update_activity({ userId, activity }),
//                   send_message({ receiverId, content })
// Server -> client: users_online, activities, user_connected, user_disconnected,
//                   activity_updated, receive_message, message_sent, message_error

import { Server } from "socket.io";
import { Message } from "../models/index.js";
import { allowedOrigin } from "./origins.js";

export function initializeSocket(httpServer) {
	const io = new Server(httpServer, { cors: { origin: allowedOrigin(), credentials: true } });

	const socketOf = new Map(); // Clerk user id -> socket id
	const activityOf = new Map(); // Clerk user id -> "Playing X by Y" | "Idle"

	io.on("connection", (socket) => {
		let me = null; // set once the client says who it is

		socket.on("user_connected", (userId) => {
			me = userId;
			socketOf.set(userId, socket.id);
			activityOf.set(userId, "Idle");
			io.emit("user_connected", userId);
			socket.emit("users_online", [...socketOf.keys()]);
			io.emit("activities", [...activityOf]);
		});

		socket.on("update_activity", ({ activity }) => {
			if (!me) return;
			activityOf.set(me, activity);
			io.emit("activity_updated", { userId: me, activity });
		});

		socket.on("send_message", async ({ receiverId, content }) => {
			if (!me) return socket.emit("message_error", "Say user_connected before sending messages");
			try {
				// The sender is whoever this socket connected as, not what the payload says.
				const message = await Message.create({ senderId: me, receiverId, content });
				const receiverSocket = socketOf.get(receiverId);
				if (receiverSocket) io.to(receiverSocket).emit("receive_message", message);
				socket.emit("message_sent", message);
			} catch (error) {
				socket.emit("message_error", error.message);
			}
		});

		socket.on("disconnect", () => {
			// Only forget the user if this was their current socket (not an older, replaced one).
			if (!me || socketOf.get(me) !== socket.id) return;
			socketOf.delete(me);
			activityOf.delete(me);
			io.emit("user_disconnected", me);
		});
	});

	return io;
}
