import { clerkClient } from "@clerk/express";

/**
 * Admins are the user whose primary email is ADMIN_EMAIL, plus any Clerk user ids
 * listed in ADMIN_USER_IDS (comma-separated). api/_lib/clerkAdmin.js applies the
 * same rule on the Vercel demo.
 */
export async function isAdmin(userId) {
	const extraIds = (process.env.ADMIN_USER_IDS ?? "").split(",").filter(Boolean);
	if (extraIds.includes(userId)) return true;
	const user = await clerkClient.users.getUser(userId);
	return Boolean(process.env.ADMIN_EMAIL) && user.primaryEmailAddress?.emailAddress === process.env.ADMIN_EMAIL;
}

/** 401 unless the request carries a valid Clerk session. */
export function protectRoute(req, res, next) {
	if (!req.auth?.userId) return res.status(401).json({ message: "Unauthorized - you must be logged in" });
	next();
}

/** 403 unless the signed-in user is an admin. Use after protectRoute. */
export async function requireAdmin(req, res, next) {
	try {
		if (!(await isAdmin(req.auth.userId))) {
			return res.status(403).json({ message: "Unauthorized - you must be an admin" });
		}
		next();
	} catch (error) {
		next(error);
	}
}
