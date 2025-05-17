import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const ChatHeader = () => {
	const { selectedUser, onlineUsers, isConnected, initSocket } = useChatStore();
	const { user } = useUser();
	const [isReconnecting, setIsReconnecting] = useState(false);

	if (!selectedUser) return null;

	const handleReconnect = () => {
		if (!user || isReconnecting) return;

		setIsReconnecting(true);
		try {
			initSocket(user.id);
			setTimeout(() => setIsReconnecting(false), 2000);
		} catch (error) {
			console.error("Error reconnecting:", error);
			setIsReconnecting(false);
		}
	};

	const isUserOnline = onlineUsers.has(selectedUser.clerkId);

	return (
		<div className='p-4 border-b border-zinc-800'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-3'>
					<div className="relative">
						<Avatar>
							<AvatarImage src={selectedUser.imageUrl} />
							<AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
						</Avatar>
						<div
							className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900
								${isUserOnline ? 'bg-green-500' : 'bg-zinc-500'}`}
						/>
					</div>
					<div>
						<h2 className='font-medium'>{selectedUser.fullName}</h2>
						<p className='text-xs text-zinc-400 flex items-center gap-1'>
							<span className={`inline-block h-2 w-2 rounded-full ${isUserOnline ? 'bg-green-500' : 'bg-zinc-500'}`}></span>
							{isUserOnline ? "Online" : "Offline"}
						</p>
					</div>
				</div>

				{!isConnected && (
					<Button
						size="sm"
						variant="outline"
						className='h-8 text-xs flex items-center gap-1'
						onClick={handleReconnect}
						disabled={isReconnecting}
					>
						<RefreshCw className={`size-3 ${isReconnecting ? 'animate-spin' : ''}`} />
						{isReconnecting ? 'Connecting...' : 'Reconnect'}
					</Button>
				)}
			</div>
		</div>
	);
};
export default ChatHeader;
