import { useUser } from "@clerk/clerk-react";
import { HeadphonesIcon, Music, Users } from "lucide-react";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { User } from "@/types";

/** "Playing Song by Artist" -> { song, artist }; null when idle. */
function parseActivity(activity: string | undefined) {
	if (!activity || activity === "Idle") return null;
	const [song, artist] = activity.replace(/^Playing /, "").split(" by ");
	return { song, artist };
}

function FriendRow({ friend, online, activity }: { friend: User; online: boolean; activity?: string }) {
	const playing = parseActivity(activity);
	return (
		<li className='group rounded-md p-3 transition-colors hover:bg-zinc-800/50'>
			<div className='flex items-start gap-3'>
				<div className='relative'>
					<Avatar className='size-10 border border-zinc-800'>
						<AvatarImage src={friend.imageUrl} alt={friend.fullName} />
						<AvatarFallback>{friend.fullName[0]}</AvatarFallback>
					</Avatar>
					<span
						className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 ${online ? "bg-green-500" : "bg-zinc-500"}`}
						aria-label={online ? "Online" : "Offline"}
					/>
				</div>
				<div className='min-w-0 flex-1'>
					<p className='flex items-center gap-2 text-sm font-medium text-white'>
						{friend.fullName}
						{playing && <Music className='size-3.5 shrink-0 text-emerald-400' aria-hidden />}
					</p>
					{playing ? (
						<div className='mt-1'>
							<p className='mt-1 truncate text-sm font-medium text-white'>{playing.song}</p>
							<p className='truncate text-xs text-zinc-400'>{playing.artist}</p>
						</div>
					) : (
						<p className='mt-1 text-xs text-zinc-400'>Idle</p>
					)}
				</div>
			</div>
		</li>
	);
}

function SignInPrompt() {
	return (
		<div className='flex h-full flex-col items-center justify-center space-y-4 p-6 text-center'>
			<div className='relative'>
				<div className='absolute -inset-1 animate-pulse rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 opacity-75 blur-lg' aria-hidden />
				<div className='relative rounded-full bg-zinc-900 p-4'>
					<HeadphonesIcon className='size-8 text-emerald-400' />
				</div>
			</div>
			<div className='max-w-[250px] space-y-2'>
				<h3 className='text-lg font-semibold text-white'>See what friends are playing</h3>
				<p className='text-sm text-zinc-400'>Sign in to see what your friends are listening to right now.</p>
			</div>
		</div>
	);
}

/** Right sidebar: each friend's online status and current song. */
export default function FriendsActivity() {
	const { user } = useUser();
	const { users, fetchUsers, onlineUsers, userActivities } = useChatStore();

	useEffect(() => {
		if (user) fetchUsers();
	}, [fetchUsers, user]);

	return (
		<div className='glass-panel flex h-full flex-col rounded-lg'>
			<div className='flex items-center gap-2 border-b border-zinc-800 p-4'>
				<Users className='size-5 shrink-0' />
				<h2 className='font-semibold'>What they're listening to</h2>
			</div>
			{!user && <SignInPrompt />}
			<ScrollArea className='flex-1'>
				<ul className='space-y-4 p-4'>
					{users.map((friend) => (
						<FriendRow
							key={friend._id}
							friend={friend}
							online={onlineUsers.has(friend.clerkId)}
							activity={userActivities.get(friend.clerkId)}
						/>
					))}
				</ul>
			</ScrollArea>
		</div>
	);
}
