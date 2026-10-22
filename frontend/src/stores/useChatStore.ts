import { io, Socket } from "socket.io-client";
import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { DEMO_ACTIVITIES, DEMO_FRIENDS, DEMO_ONLINE, addDemoMessage, getDemoConversation, nextDemoReply } from "@/lib/demoChat";
import { isDemoMode } from "@/lib/demoMode";
import { Message, User } from "@/types";

/** True on the Vercel demo, where friends and replies are simulated (lib/demoChat). */
export const isVercelProduction = isDemoMode;

/** What the stores need from a socket; the demo uses a do-nothing stand-in. */
type ChatSocket = Pick<Socket, "connected" | "connect" | "disconnect" | "emit" | "on" | "off"> & { auth?: unknown };

const offlineSocket: ChatSocket = {
	connected: false,
	connect: () => offlineSocket as Socket,
	disconnect: () => offlineSocket as Socket,
	emit: () => offlineSocket as Socket,
	on: () => offlineSocket as Socket,
	off: () => offlineSocket as Socket,
};

/** The Socket.IO server: the API's origin in development, this site's origin otherwise. */
function serverUrl() {
	const api = import.meta.env.VITE_API_URL as string | undefined;
	return import.meta.env.DEV && api ? api.replace(/\/api\/?$/, "") : window.location.origin;
}

const socket: ChatSocket = isDemoMode()
	? offlineSocket
	: io(serverUrl(), {
			autoConnect: false, // connect once we know who the user is
			withCredentials: true,
			reconnectionAttempts: 10,
			reconnectionDelay: 1000,
			timeout: 20000,
			transports: ["websocket", "polling"],
		});

// Server events this store listens to; removed and re-added on every (re)connect.
const SERVER_EVENTS = [
	"connect",
	"connect_error",
	"reconnect",
	"users_online",
	"activities",
	"user_connected",
	"user_disconnected",
	"receive_message",
	"message_sent",
	"message_error",
	"activity_updated",
];

/** Signed-in user's Clerk id, so demo conversations know which side is "you". */
let demoSelfId = "";

interface ChatStore {
	users: User[];
	isLoading: boolean;
	error: string | null;
	socket: ChatSocket;
	isConnected: boolean;
	onlineUsers: Set<string>;
	userActivities: Map<string, string>;
	messages: Message[];
	selectedUser: User | null;

	fetchUsers: () => Promise<void>;
	initSocket: (userId: string) => void;
	disconnectSocket: () => void;
	sendMessage: (receiverId: string, senderId: string, content: string) => void;
	fetchMessages: (userId: string) => Promise<void>;
	setSelectedUser: (user: User | null) => void;
}

const apiError = (error: unknown, fallback: string) =>
	(error as { response?: { data?: { message?: string } } }).response?.data?.message ?? fallback;

export const useChatStore = create<ChatStore>((set, get) => ({
	users: [],
	isLoading: false,
	error: null,
	socket,
	isConnected: false,
	onlineUsers: new Set(),
	userActivities: new Map(),
	messages: [],
	selectedUser: null,

	setSelectedUser: (user) => set({ selectedUser: user }),

	fetchUsers: async () => {
		if (isDemoMode()) return set({ users: DEMO_FRIENDS });
		set({ isLoading: true, error: null });
		try {
			set({ users: (await axiosInstance.get("/users")).data });
		} catch (error) {
			console.error("Loading users failed:", error);
			if (import.meta.env.DEV) set({ error: apiError(error, "Failed to fetch users") });
			set({ users: DEMO_FRIENDS }); // something to show instead of an empty sidebar
		} finally {
			set({ isLoading: false });
		}
	},

	initSocket: (userId) => {
		if (isDemoMode()) {
			demoSelfId = userId;
			return set({ isConnected: true, onlineUsers: DEMO_ONLINE, userActivities: DEMO_ACTIVITIES });
		}
		if (get().isConnected && socket.connected) return;

		// Start clean: drop a half-open connection and any listeners from a previous call.
		socket.disconnect();
		SERVER_EVENTS.forEach((event) => socket.off(event));
		socket.auth = { userId };

		const update = (fn: (state: ChatStore) => Partial<ChatStore>) => set(fn);
		socket.on("connect", () => {
			socket.emit("user_connected", userId);
			set({ isConnected: true });
		});
		socket.on("reconnect", () => socket.emit("user_connected", userId));
		socket.on("connect_error", (error: Error) => console.error("Chat connection failed:", error.message));
		socket.on("message_error", (error: string) => console.error("Chat server rejected a message:", error));

		socket.on("users_online", (ids: string[]) => set({ onlineUsers: new Set(ids) }));
		socket.on("user_connected", (id: string) => update((s) => ({ onlineUsers: new Set(s.onlineUsers).add(id) })));
		socket.on("user_disconnected", (id: string) =>
			update((s) => {
				const online = new Set(s.onlineUsers);
				online.delete(id);
				return { onlineUsers: online };
			}),
		);

		socket.on("activities", (entries: [string, string][]) => set({ userActivities: new Map(entries) }));
		socket.on("activity_updated", ({ userId: id, activity }: { userId: string; activity: string }) =>
			update((s) => ({ userActivities: new Map(s.userActivities).set(id, activity) })),
		);

		// Our own sent messages come back as "message_sent"; others' arrive as "receive_message".
		const append = (message: Message) => update((s) => ({ messages: [...s.messages, message] }));
		socket.on("receive_message", append);
		socket.on("message_sent", append);

		socket.connect();
		set({ isConnected: socket.connected });
	},

	disconnectSocket: () => {
		if (!get().isConnected) return;
		socket.disconnect();
		set({ isConnected: false });
	},

	sendMessage: (receiverId, senderId, content) => {
		if (isDemoMode()) {
			set((s) => ({ messages: [...s.messages, addDemoMessage(receiverId, senderId, receiverId, content)] }));
			// The simulated friend answers a moment later, if that chat is still open.
			setTimeout(() => {
				const reply = addDemoMessage(receiverId, receiverId, senderId, nextDemoReply());
				if (get().selectedUser?.clerkId === receiverId) set((s) => ({ messages: [...s.messages, reply] }));
			}, 1500);
			return;
		}
		if (!socket.connected) socket.connect();
		socket.emit("send_message", { receiverId, senderId, content });
	},

	fetchMessages: async (userId) => {
		if (isDemoMode()) return set({ messages: getDemoConversation(userId, demoSelfId) });
		set({ isLoading: true, error: null });
		try {
			set({ messages: (await axiosInstance.get(`/users/messages/${userId}`)).data });
		} catch (error) {
			console.error("Loading messages failed:", error);
			if (import.meta.env.DEV) set({ error: apiError(error, "Failed to fetch messages") });
			set({ messages: [] });
		} finally {
			set({ isLoading: false });
		}
	},
}));
