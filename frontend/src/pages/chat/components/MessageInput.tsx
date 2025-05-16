import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { Send } from "lucide-react";
import { useState } from "react";

const MessageInput = () => {
	const [newMessage, setNewMessage] = useState("");
	const { user } = useUser();
	const { selectedUser, sendMessage } = useChatStore();

	const handleSend = () => {
		console.log("MessageInput: Attempting to send message");
		console.log("MessageInput: Selected user:", selectedUser);
		console.log("MessageInput: Current user:", user);
		console.log("MessageInput: Message content:", newMessage);

		if (!selectedUser) {
			console.error("MessageInput: No selected user");
			return;
		}
		if (!user) {
			console.error("MessageInput: No current user");
			return;
		}
		if (!newMessage.trim()) {
			console.error("MessageInput: Empty message");
			return;
		}

		console.log("MessageInput: Sending message to", selectedUser.clerkId, "from", user.id);
		sendMessage(selectedUser.clerkId, user.id, newMessage.trim());
		setNewMessage("");
	};

	return (
		<div className='p-4 mt-auto border-t border-zinc-800'>
			<div className='flex gap-2'>
				<Input
					placeholder='Type a message'
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					className='bg-zinc-800 border-none'
					onKeyDown={(e) => e.key === "Enter" && handleSend()}
				/>

				<Button size={"icon"} onClick={handleSend} disabled={!newMessage.trim()}>
					<Send className='size-4' />
				</Button>
			</div>
		</div>
	);
};
export default MessageInput;
