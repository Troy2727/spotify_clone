import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

export const getAllUsers = async (req, res, next) => {
	try {
		const currentUserId = req.auth.userId;
		console.log("Fetching users for currentUserId:", currentUserId);

		// First, let's check all users in the database
		const allUsers = await User.find({});
		console.log("All users in database:", allUsers);

		// Now get users excluding the current user
		const users = await User.find({ clerkId: { $ne: currentUserId } });
		console.log("Users returned (excluding current user):", users);

		res.status(200).json(users);
	} catch (error) {
		console.error("Error fetching users:", error);
		next(error);
	}
};

export const getMessages = async (req, res, next) => {
	try {
		const myId = req.auth.userId;
		const { userId } = req.params;

		console.log("Fetching messages between users:", { myId, userId });

		// Check if both users exist
		const me = await User.findOne({ clerkId: myId });
		const otherUser = await User.findOne({ clerkId: userId });

		console.log("Current user in database:", me);
		console.log("Other user in database:", otherUser);

		const messages = await Message.find({
			$or: [
				{ senderId: userId, receiverId: myId },
				{ senderId: myId, receiverId: userId },
			],
		}).sort({ createdAt: 1 });

		console.log("Messages found:", messages);

		res.status(200).json(messages);
	} catch (error) {
		console.error("Error fetching messages:", error);
		next(error);
	}
};
