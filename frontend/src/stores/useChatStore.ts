import { axiosInstance } from "@/lib/axios";
import { Message, User } from "@/types";
import { create } from "zustand";
import { io } from "socket.io-client";

interface ChatStore {
	users: User[];
	isLoading: boolean;
	error: string | null;
	socket: any;
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

// Use environment variable or default to window location for production
const getBaseURL = () => {
	// In development, use the API URL from environment variables
	if (import.meta.env.DEV && import.meta.env.VITE_API_URL) {
		// Extract the base URL without the /api suffix
		return import.meta.env.VITE_API_URL.replace('/api', '');
	}

	// In production, use the current origin
	return window.location.origin;
};

// Check if we're in Vercel production environment
const isVercelProduction = () => {
	return !import.meta.env.DEV && window.location.hostname.includes('vercel.app');
};

// Initialize socket with dynamic configuration, but only if not in Vercel production
let socket;
if (!isVercelProduction()) {
	socket = io(getBaseURL(), {
		autoConnect: false, // only connect if user is authenticated
		withCredentials: true,
		path: '/socket.io', // Default path for socket.io
	});
} else {
	// Create a dummy socket for Vercel production
	console.log('Running in Vercel production - using mock socket');
	socket = {
		connected: false,
		on: () => {},
		emit: () => {},
		connect: () => {},
		disconnect: () => {},
	};
}

export const useChatStore = create<ChatStore>((set, get) => ({
	users: [],
	isLoading: false,
	error: null,
	socket: socket,
	isConnected: false,
	onlineUsers: new Set(),
	userActivities: new Map(),
	messages: [],
	selectedUser: null,

	setSelectedUser: (user) => set({ selectedUser: user }),

	fetchUsers: async () => {
		console.log("Fetching users...");
		set({ isLoading: true, error: null });

		// If we're in Vercel production, use mock users
		if (isVercelProduction()) {
			console.log("Running in Vercel production - using mock users");
			const mockUsers = [
				{
					_id: "user1",
					clerkId: "test_user_1",
					fullName: "Test User",
					imageUrl: "/cover-images/1.jpg"
				},
				{
					_id: "user2",
					clerkId: "test_user_2",
					fullName: "Another Test User",
					imageUrl: "/cover-images/2.jpg"
				}
			];
			set({ users: mockUsers });
			set({ isLoading: false });
			return;
		}

		try {
			const response = await axiosInstance.get("/users");
			console.log("Users fetched successfully:", response.data);
			set({ users: response.data });
		} catch (error: any) {
			console.error("Error fetching users:", error);
			// Don't show error to user in production
			if (import.meta.env.DEV) {
				set({ error: error.response?.data?.message || "Failed to fetch users" });
			}
			// Use mock users on error
			const fallbackUsers = [
				{
					_id: "user1",
					clerkId: "test_user_1",
					fullName: "Test User",
					imageUrl: "/cover-images/1.jpg"
				},
				{
					_id: "user2",
					clerkId: "test_user_2",
					fullName: "Another Test User",
					imageUrl: "/cover-images/2.jpg"
				}
			];
			set({ users: fallbackUsers });
		} finally {
			set({ isLoading: false });
		}
	},

	initSocket: (userId) => {
		console.log("initSocket called with userId:", userId);

		// If we're in Vercel production, don't actually connect
		if (isVercelProduction()) {
			console.log("Running in Vercel production - skipping socket connection");
			// Set mock online users for better UI experience
			set({
				isConnected: true,
				onlineUsers: new Set(['test_user_1', 'test_user_2'])
			});
			return;
		}

		if (!get().isConnected) {
			socket.auth = { userId };
			console.log("Connecting socket with auth:", socket.auth);
			socket.connect();

			socket.on("connect", () => {
				console.log("Socket connected successfully");
				socket.emit("user_connected", userId);
			});

			socket.on("connect_error", (error) => {
				console.error("Socket connection error:", error);
				// If connection fails, set mock online users for better UI experience
				set({
					onlineUsers: new Set(['test_user_1', 'test_user_2'])
				});
			});

			socket.on("users_online", (users: string[]) => {
				set({ onlineUsers: new Set(users) });
			});

			socket.on("activities", (activities: [string, string][]) => {
				set({ userActivities: new Map(activities) });
			});

			socket.on("user_connected", (userId: string) => {
				set((state) => ({
					onlineUsers: new Set([...state.onlineUsers, userId]),
				}));
			});

			socket.on("user_disconnected", (userId: string) => {
				set((state) => {
					const newOnlineUsers = new Set(state.onlineUsers);
					newOnlineUsers.delete(userId);
					return { onlineUsers: newOnlineUsers };
				});
			});

			socket.on("receive_message", (message: Message) => {
				set((state) => ({
					messages: [...state.messages, message],
				}));
			});

			socket.on("message_sent", (message: Message) => {
				set((state) => ({
					messages: [...state.messages, message],
				}));
			});

			socket.on("activity_updated", ({ userId, activity }) => {
				set((state) => {
					const newActivities = new Map(state.userActivities);
					newActivities.set(userId, activity);
					return { userActivities: newActivities };
				});
			});

			set({ isConnected: true });
		}
	},

	disconnectSocket: () => {
		if (get().isConnected) {
			socket.disconnect();
			set({ isConnected: false });
		}
	},

	sendMessage: async (receiverId, senderId, content) => {
		console.log("Sending message:", { receiverId, senderId, content });

		// If we're in Vercel production, create a mock message instead of using socket
		if (isVercelProduction()) {
			console.log("Running in Vercel production - creating mock message");
			const mockMessage: Message = {
				_id: `mock_${Date.now()}`,
				senderId,
				receiverId,
				content,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			};

			// Add the message to the state
			set((state) => ({
				messages: [...state.messages, mockMessage]
			}));

			return;
		}

		const socket = get().socket;
		if (!socket) {
			console.error("Socket not available for sending message");
			return;
		}
		if (!socket.connected) {
			console.error("Socket not connected. Attempting to reconnect...");
			socket.connect();
		}

		socket.emit("send_message", { receiverId, senderId, content });
		console.log("Message emit sent to socket");
	},

	fetchMessages: async (userId: string) => {
		console.log("Fetching messages for userId:", userId);
		set({ isLoading: true, error: null });

		// If we're in Vercel production, use mock messages
		if (isVercelProduction()) {
			console.log("Running in Vercel production - using mock messages");
			const mockMessages = [
				{
					_id: "mock1",
					senderId: "user_2x74anfpqe1ITRS49EiPbTS6jaE",
					receiverId: userId,
					content: "Hey there! How are you?",
					createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
					updatedAt: new Date(Date.now() - 3600000).toISOString()
				},
				{
					_id: "mock2",
					senderId: userId,
					receiverId: "user_2x74anfpqe1ITRS49EiPbTS6jaE",
					content: "I'm doing great! How about you?",
					createdAt: new Date(Date.now() - 3500000).toISOString(), // 58 minutes ago
					updatedAt: new Date(Date.now() - 3500000).toISOString()
				},
				{
					_id: "mock3",
					senderId: "user_2x74anfpqe1ITRS49EiPbTS6jaE",
					receiverId: userId,
					content: "Just listening to some music on Spotify Clone!",
					createdAt: new Date(Date.now() - 3400000).toISOString(), // 56 minutes ago
					updatedAt: new Date(Date.now() - 3400000).toISOString()
				}
			];
			set({ messages: mockMessages });
			set({ isLoading: false });
			return;
		}

		try {
			const response = await axiosInstance.get(`/users/messages/${userId}`);
			console.log("Messages fetched successfully:", response.data);
			set({ messages: response.data });
		} catch (error: any) {
			console.error("Error fetching messages:", error);
			// Don't show error to user in production
			if (import.meta.env.DEV) {
				set({ error: error.response?.data?.message || "Failed to fetch messages" });
			}
			// Use empty messages array on error
			set({ messages: [] });
		} finally {
			set({ isLoading: false });
		}
	},
}));
