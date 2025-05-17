import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { AlertCircle, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

const MessageInput = () => {
	const [newMessage, setNewMessage] = useState("");
	const [isSending, setIsSending] = useState(false);
	const { user } = useUser();
	const { selectedUser, sendMessage, isConnected, initSocket } = useChatStore();

	const handleSend = () => {
		if (isSending) return;

		console.log("MessageInput: Attempting to send message");
		console.log("MessageInput: Selected user:", selectedUser);
		console.log("MessageInput: Current user:", user);
		console.log("MessageInput: Message content:", newMessage);
		console.log("MessageInput: Connection status:", isConnected);

		if (!selectedUser) {
			console.error("MessageInput: No selected user");
			toast.error("Please select a user to chat with");
			return;
		}
		if (!user) {
			console.error("MessageInput: No current user");
			toast.error("You need to be signed in to send messages");
			return;
		}
		if (!newMessage.trim()) {
			console.error("MessageInput: Empty message");
			return;
		}
		if (!isConnected) {
			console.error("MessageInput: Not connected to chat server");
			toast.error("Not connected to chat server. Please reconnect.");

			// Try to reconnect
			if (user) {
				try {
					initSocket(user.id);
					toast.success("Reconnected to chat server");
				} catch (error) {
					console.error("Error reconnecting:", error);
				}
			}
			return;
		}

		setIsSending(true);

		try {
			console.log("MessageInput: Sending message to", selectedUser.clerkId, "from", user.id);
			sendMessage(selectedUser.clerkId, user.id, newMessage.trim());
			setNewMessage("");
		} catch (error) {
			console.error("Error sending message:", error);
			toast.error("Failed to send message");
		} finally {
			setIsSending(false);
		}
	};

	return (
		<div className='p-2 sm:p-4 mt-auto border-t border-zinc-800'>
			{!isConnected && (
				<div className='flex items-center gap-2 mb-2 p-2 bg-red-900/20 rounded-md'>
					<AlertCircle className='size-4 text-red-500' />
					<span className='text-xs text-red-400'>
						Not connected to chat server. Messages won't be delivered.
					</span>
				</div>
			)}

			<div className='flex gap-2'>
				<Input
					placeholder={isConnected ? 'Type a message' : 'Reconnect to send messages'}
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					className='bg-zinc-800 border-none text-sm h-9 sm:h-10'
					onKeyDown={(e) => e.key === "Enter" && handleSend()}
					disabled={!isConnected}
				/>

				<Button
					size={"icon"}
					onClick={handleSend}
					disabled={!newMessage.trim() || isSending || !isConnected}
					className="h-9 w-9 sm:h-10 sm:w-10"
				>
					<Send className='size-4' />
				</Button>
			</div>
		</div>
	);
};
export default MessageInput;
