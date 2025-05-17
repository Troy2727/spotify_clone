import Topbar from "@/components/Topbar";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState, useCallback } from "react";
import UsersList from "./components/UsersList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const formatTime = (date: string) => {
	return new Date(date).toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};

const ChatPage = () => {
	const { user } = useUser();
	const { messages, selectedUser, fetchUsers, fetchMessages, initSocket, isConnected, disconnectSocket } = useChatStore();
	const [socketInitialized, setSocketInitialized] = useState(false);
	const [isConnecting, setIsConnecting] = useState(false);

	// Function to initialize socket connection
	const connectToChat = useCallback(() => {
		if (!user) return;

		setIsConnecting(true);
		console.log("ChatPage: Initializing socket for user:", user.id);

		try {
			// First disconnect any existing connection
			disconnectSocket();

			// Then initialize a new connection
			setTimeout(() => {
				initSocket(user.id);
				setSocketInitialized(true);
				toast.success("Connected to chat server");
				setIsConnecting(false);
			}, 500); // Small delay to ensure disconnect completes
		} catch (error) {
			console.error("Error initializing socket:", error);
			toast.error("Failed to connect to chat server");
			setIsConnecting(false);
		}
	}, [user, initSocket, disconnectSocket]);

	// Initialize socket connection when user is available
	useEffect(() => {
		console.log("ChatPage: User state changed:", user);
		if (user && !socketInitialized && !isConnecting) {
			connectToChat();
		}
	}, [user, socketInitialized, isConnecting, connectToChat]);

	// Fetch users when user is available
	useEffect(() => {
		if (user) {
			console.log("ChatPage: Fetching users for user:", user.id);
			fetchUsers();
		}
	}, [fetchUsers, user]);

	// Fetch messages when selected user changes
	useEffect(() => {
		console.log("ChatPage: Selected user changed:", selectedUser);
		if (selectedUser) {
			console.log("ChatPage: Fetching messages for selected user:", selectedUser.clerkId);
			fetchMessages(selectedUser.clerkId);
		}
	}, [selectedUser, fetchMessages]);

	console.log("ChatPage: Connection status:", isConnected);
	console.log("ChatPage: Current messages:", messages);
	console.log("ChatPage: Current user:", user);

	return (
		<main className='h-full rounded-lg bg-gradient-to-b from-zinc-800 to-zinc-900 overflow-hidden'>
			<Topbar />

			{/* Connection status indicator */}
			<div className='flex items-center justify-end px-4 py-1 bg-zinc-900/50'>
				<div className='flex items-center gap-2'>
					<div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
					<span className='text-xs text-zinc-400'>
						{isConnected ? 'Connected to chat' : 'Disconnected'}
					</span>
					{!isConnected && (
						<Button
							size="sm"
							variant="outline"
							className='h-7 text-xs flex items-center gap-1'
							onClick={connectToChat}
							disabled={isConnecting}
						>
							<RefreshCw className='size-3' />
							{isConnecting ? 'Connecting...' : 'Reconnect'}
						</Button>
					)}
				</div>
			</div>

			<div className='grid lg:grid-cols-[300px_1fr] grid-cols-[70px_1fr] sm:grid-cols-[80px_1fr] h-[calc(100vh-200px)]'>
				<UsersList />

				{/* chat message */}
				<div className='flex flex-col h-full'>
					{selectedUser ? (
						<>
							<ChatHeader />

							{/* Messages */}
							<ScrollArea className='h-[calc(100vh-360px)]'>
								<div className='p-2 sm:p-4 space-y-3 sm:space-y-4'>
									{messages.length > 0 ? (
										messages.map((message) => (
											<div
												key={message._id}
												className={`flex items-start gap-2 sm:gap-3 ${
													message.senderId === user?.id ? "flex-row-reverse" : ""
												}`}
											>
												<Avatar className='size-6 sm:size-8'>
													<AvatarImage
														src={
															message.senderId === user?.id
																? user.imageUrl
																: selectedUser.imageUrl
														}
													/>
												</Avatar>

												<div
													className={`rounded-lg p-2 sm:p-3 max-w-[75%] sm:max-w-[70%]
														${message.senderId === user?.id ? "bg-green-500" : "bg-zinc-800"}
													`}
												>
													<p className='text-xs sm:text-sm'>{message.content}</p>
													<span className='text-[10px] sm:text-xs text-zinc-300 mt-1 block'>
														{formatTime(message.createdAt)}
													</span>
												</div>
											</div>
										))
									) : (
										<div className='flex items-center justify-center h-full py-10'>
											<p className='text-zinc-500 text-sm'>No messages yet. Start a conversation!</p>
										</div>
									)}
								</div>
							</ScrollArea>

							<MessageInput />
						</>
					) : (
						<NoConversationPlaceholder />
					)}
				</div>
			</div>
		</main>
	);
};
export default ChatPage;

const NoConversationPlaceholder = () => (
	<div className='flex flex-col items-center justify-center h-full space-y-6'>
		<img src='/spotify.png' alt='Spotify' className='size-16 animate-bounce' />
		<div className='text-center'>
			<h3 className='text-zinc-300 text-lg font-medium mb-1'>No conversation selected</h3>
			<p className='text-zinc-500 text-sm'>Choose a friend to start chatting</p>
		</div>
	</div>
);
