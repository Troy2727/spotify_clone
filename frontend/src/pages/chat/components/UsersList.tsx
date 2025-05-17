import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";
import { Users } from "lucide-react";

const UsersList = () => {
	const { users, selectedUser, isLoading, setSelectedUser, onlineUsers } = useChatStore();

	return (
		<div className='border-r border-zinc-800'>
			<div className='flex flex-col h-full'>
				{/* Mobile header */}
				<div className='p-3 border-b border-zinc-800 flex items-center justify-center lg:justify-start gap-2 lg:hidden'>
					<Users className='size-4' />
					<span className='font-medium'>Contacts</span>
				</div>

				<ScrollArea className='h-[calc(100vh-320px)] md:h-[calc(100vh-280px)]'>
					<div className='space-y-2 p-2 sm:p-4'>
						{isLoading ? (
							<UsersListSkeleton />
						) : (
							users.map((user) => (
								<div
									key={user._id}
									onClick={() => setSelectedUser(user)}
									className={`flex items-center justify-center lg:justify-start gap-2 sm:gap-3 p-2 sm:p-3
										rounded-lg cursor-pointer transition-colors
                    ${selectedUser?.clerkId === user.clerkId ? "bg-zinc-800" : "hover:bg-zinc-800/50"}`}
								>
									<div className='relative'>
										<Avatar className='size-8 md:size-10 lg:size-12'>
											<AvatarImage src={user.imageUrl} />
											<AvatarFallback>{user.fullName[0]}</AvatarFallback>
										</Avatar>
										{/* online indicator */}
										<div
											className={`absolute bottom-0 right-0 h-2 w-2 sm:h-3 sm:w-3 rounded-full ring-2 ring-zinc-900
                        ${onlineUsers.has(user.clerkId) ? "bg-green-500" : "bg-zinc-500"}`}
										/>
									</div>

									<div className='flex-1 min-w-0 lg:block hidden'>
										<span className='font-medium truncate'>{user.fullName}</span>
									</div>
								</div>
							))
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};

export default UsersList;
