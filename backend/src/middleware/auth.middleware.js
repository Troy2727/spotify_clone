import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
	if (!req.auth.userId) {
		return res.status(401).json({ message: "Unauthorized - you must be logged in" });
	}
	next();
};

export const requireAdmin = async (req, res, next) => {
	try {
		console.log("Checking admin status for user:", req.auth.userId);
		const currentUser = await clerkClient.users.getUser(req.auth.userId);
		console.log("User email:", currentUser.primaryEmailAddress?.emailAddress);
		console.log("Admin email from env:", process.env.ADMIN_EMAIL);

		// Check if user is admin by email
		let isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

		// For testing: Allow specific user IDs to be admin
		// This is useful for testing in environments where email might not match
		const adminUserIds = process.env.ADMIN_USER_IDS ? process.env.ADMIN_USER_IDS.split(',') : [];
		if (adminUserIds.includes(req.auth.userId)) {
			console.log("User is admin by user ID override");
			isAdmin = true;
		}

		console.log("Is admin:", isAdmin);

		if (!isAdmin) {
			console.log("Admin access denied for user:", req.auth.userId);
			return res.status(403).json({ message: "Unauthorized - you must be an admin" });
		}

		console.log("Admin access granted for user:", req.auth.userId);
		next();
	} catch (error) {
		console.error("Error in requireAdmin middleware:", error);
		next(error);
	}
};
