import { Users } from "lucide-react";
import UsersListSkeleton from "@/components/skeletons/UsersListSkeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/useChatStore";

/** Chat contacts with online dots. Narrow screens show avatars only. */
export default function UsersList() {
	const { users, selectedUser, isLoading, setSelectedUser, onlineUsers } = useChatStore();

	return (
		<aside className='flex h-full flex-col border-r border-zinc-800'>
			<h2 className='flex items-center justify-center gap-2 border-b border-zinc-800 p-3 font-medium lg:hidden'>
				<Users className='size-4' />
				Contacts
			</h2>
			<ScrollArea className='h-[calc(100vh-320px)] md:h-[calc(100vh-280px)]'>
				{isLoading ? (
					<div className='space-y-2 p-2 sm:p-4'>
						<UsersListSkeleton />
					</div>
				) : (
					<ul className='space-y-2 p-2 sm:p-4'>
						{users.map((contact) => {
							const active = selectedUser?.clerkId === contact.clerkId;
							const online = onlineUsers.has(contact.clerkId);
							return (
								<li key={contact._id}>
									<button
										type='button'
										onClick={() => setSelectedUser(contact)}
										aria-label={contact.fullName}
										aria-current={active || undefined}
										className={`flex w-full items-center justify-center gap-2 rounded-lg p-2 transition-colors sm:gap-3 sm:p-3 lg:justify-start ${
											active ? "bg-zinc-800" : "hover:bg-zinc-800/50"
										}`}
									>
										<span className='relative'>
											<Avatar className='size-8 md:size-10 lg:size-12'>
												<AvatarImage src={contact.imageUrl} alt='' />
												<AvatarFallback>{contact.fullName[0]}</AvatarFallback>
											</Avatar>
											<span
												className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ring-2 ring-zinc-900 sm:h-3 sm:w-3 ${online ? "bg-green-500" : "bg-zinc-500"}`}
											/>
										</span>
										<span className='hidden min-w-0 flex-1 truncate text-left font-medium lg:block'>{contact.fullName}</span>
									</button>
								</li>
							);
						})}
					</ul>
				)}
			</ScrollArea>
		</aside>
	);
}
