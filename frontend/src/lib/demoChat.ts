import { Message, User } from "@/types";

// Simulated friends and conversations for the Vercel demo, which has no chat server or database.

const avatar = (initials: string, from: string, to: string) =>
	`data:image/svg+xml,${encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
			`<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
			`<stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>` +
			`<rect width="64" height="64" fill="url(#g)"/>` +
			`<text x="32" y="41" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="700" fill="#fff">${initials}</text>` +
			`</svg>`
	)}`;

export const DEMO_FRIENDS: User[] = [
	{ _id: "user1", clerkId: "test_user_1", fullName: "Maya Chen", imageUrl: avatar("MC", "#1db954", "#0e7490") },
	{ _id: "user2", clerkId: "test_user_2", fullName: "Jordan Rivera", imageUrl: avatar("JR", "#f97316", "#be123c") },
	{ _id: "user3", clerkId: "demo_user_3", fullName: "Priya Patel", imageUrl: avatar("PP", "#8b5cf6", "#4338ca") },
	{ _id: "user4", clerkId: "demo_user_4", fullName: "Sam Okafor", imageUrl: avatar("SO", "#eab308", "#b45309") },
];

export const DEMO_ONLINE = new Set(["test_user_1", "test_user_2", "demo_user_3"]);

// "Playing <title> by <artist>" is the format FriendsActivity parses
export const DEMO_ACTIVITIES = new Map([
	["test_user_1", "Playing Believer by Imagine Dragons"],
	["test_user_2", "Playing The Hills by The Weeknd"],
	["demo_user_3", "Playing Dancing Queen by ABBA"],
	["demo_user_4", "Idle"],
]);

// [fromFriend, content, minutesAgo]
const SEED: Record<string, [boolean, string, number][]> = {
	test_user_1: [
		[true, "Have you ever listened to Evolve by Imagine Dragons?", 52],
		[false, "Only a couple of songs, is it good?", 50],
		[true, "Believer has been on repeat all morning 🔁", 49],
	],
	test_user_2: [
		[true, "The Hills hits different at 2am", 180],
		[false, "Every Weeknd song does honestly", 175],
	],
	demo_user_3: [[true, "Made a 70s playlist, starting with Dancing Queen obviously 🪩", 30]],
	demo_user_4: [[true, "Send me something new to listen to this weekend", 1440]],
};

const REPLIES = [
	"Ha, totally agree 🎧",
	"Adding that to my playlist right now",
	"Have you listened to Kamikaze all the way through?",
	"Okay you have great taste",
	"We should make a shared playlist",
	"That one's been stuck in my head all week",
];

const conversations = new Map<string, Message[]>();
let replyIndex = 0;

const makeMessage = (senderId: string, receiverId: string, content: string, createdAt = new Date()): Message => ({
	_id: `demo_${senderId}_${createdAt.getTime()}_${Math.random().toString(36).slice(2, 7)}`,
	senderId,
	receiverId,
	content,
	createdAt: createdAt.toISOString(),
	updatedAt: createdAt.toISOString(),
});

// Conversation with a friend, seeded on first open and kept for the rest of the session
export const getDemoConversation = (friendId: string, selfId: string): Message[] => {
	if (!conversations.has(friendId)) {
		const seeded = (SEED[friendId] ?? []).map(([fromFriend, content, minutesAgo]) =>
			makeMessage(
				fromFriend ? friendId : selfId,
				fromFriend ? selfId : friendId,
				content,
				new Date(Date.now() - minutesAgo * 60_000)
			)
		);
		conversations.set(friendId, seeded);
	}
	return [...conversations.get(friendId)!];
};

export const addDemoMessage = (friendId: string, senderId: string, receiverId: string, content: string): Message => {
	const message = makeMessage(senderId, receiverId, content);
	conversations.set(friendId, [...(conversations.get(friendId) ?? []), message]);
	return message;
};

export const nextDemoReply = () => REPLIES[replyIndex++ % REPLIES.length];
