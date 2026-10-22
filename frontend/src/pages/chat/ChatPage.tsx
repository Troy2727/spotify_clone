import { useUser } from "@clerk/clerk-react";
import { RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import Topbar from "@/components/Topbar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { isVercelProduction, useChatStore } from "@/stores/useChatStore";
import { Message } from "@/types";
import ChatHeader from "./components/ChatHeader";
import MessageInput from "./components/MessageInput";
import UsersList from "./components/UsersList";

const timeOf = (iso: string) => new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

function Bubble({ message, mine, avatar }: { message: Message; mine: boolean; avatar?: string }) {
	return (
		<div className={`flex items-start gap-2 sm:gap-3 ${mine ? "flex-row-reverse" : ""}`}>
			<Avatar className='size-6 sm:size-8'>
				<AvatarImage src={avatar} />
			</Avatar>
			<div className={`max-w-[75%] rounded-lg p-2 sm:max-w-[70%] sm:p-3 ${mine ? "bg-green-500" : "bg-zinc-800"}`}>
				<p className='text-xs sm:text-sm'>{message.content}</p>
				<time dateTime={message.createdAt} className='mt-1 block text-[10px] text-zinc-300 sm:text-xs'>
					{timeOf(message.createdAt)}
				</time>
			</div>
		</div>
	);
}

function EmptyState() {
	return (
		<div className='flex h-full flex-col items-center justify-center space-y-6'>
			<img src='/spotify.png' alt='' className='size-16 animate-bounce' />
			<div className='text-center'>
				<h3 className='mb-1 text-lg font-medium text-zinc-300'>No conversation selected</h3>
				<p className='text-sm text-zinc-500'>Choose a friend to start chatting</p>
			</div>
		</div>
	);
}

/** Direct messages: contacts on the left, the open conversation on the right. */
export default function ChatPage() {
	const { user } = useUser();
	const { messages, selectedUser, fetchUsers, fetchMessages, initSocket, isConnected } = useChatStore();
	const demo = isVercelProduction();

	const connect = () => {
		if (!user) return;
		initSocket(user.id);
		toast.success(demo ? "Demo chat ready" : "Connected to chat server");
	};

	useEffect(() => {
		if (!user) return;
		initSocket(user.id);
		fetchUsers();
	}, [user, initSocket, fetchUsers]);

	useEffect(() => {
		if (selectedUser) fetchMessages(selectedUser.clerkId);
	}, [selectedUser, fetchMessages]);

	return (
		<main className='glass-panel flex h-full flex-col overflow-hidden rounded-lg'>
			<Topbar />

			<div className='flex items-center justify-end gap-2 bg-zinc-900/50 px-4 py-1' role='status'>
				<span className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
				<span className='text-xs text-zinc-400'>
					{!isConnected ? "Disconnected" : demo ? "Demo chat · friends are simulated" : "Connected to chat"}
				</span>
				{!isConnected && (
					<Button size='sm' variant='outline' className='flex h-7 items-center gap-1 text-xs' onClick={connect}>
						<RefreshCw className='size-3' />
						Reconnect
					</Button>
				)}
			</div>

			<div className='grid min-h-0 flex-1 grid-cols-[70px_1fr] sm:grid-cols-[80px_1fr] lg:grid-cols-[300px_1fr]'>
				<UsersList />
				<div className='flex h-full flex-col'>
					{selectedUser ? (
						<>
							<ChatHeader />
							<ScrollArea className='min-h-0 flex-1'>
								<div className='space-y-3 p-2 sm:space-y-4 sm:p-4'>
									{messages.length === 0 ? (
										<p className='py-10 text-center text-sm text-zinc-500'>No messages yet. Start a conversation!</p>
									) : (
										messages.map((message) => {
											const mine = message.senderId === user?.id;
											return (
												<Bubble key={message._id} message={message} mine={mine} avatar={mine ? user?.imageUrl : selectedUser.imageUrl} />
											);
										})
									)}
								</div>
							</ScrollArea>
							<MessageInput />
						</>
					) : (
						<EmptyState />
					)}
				</div>
			</div>
		</main>
	);
}
