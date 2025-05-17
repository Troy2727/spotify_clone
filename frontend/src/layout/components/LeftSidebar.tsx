import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { SignedIn, useClerk } from "@clerk/clerk-react";
import { HomeIcon, LayoutDashboardIcon, Library, LogOut, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
	const { albums, fetchAlbums, isLoading } = useMusicStore();
	const { signOut } = useClerk();
	const { isAdmin } = useAuthStore();

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);

	const handleSignOut = () => {
		signOut();
	};

	return (
		<div className='h-full flex flex-col gap-2'>
			{/* Navigation menu */}

			<div className='rounded-lg bg-zinc-900 p-3 sm:p-4'>
				<div className='space-y-2'>
					<Link
						to={"/"}
						className={cn(
							buttonVariants({
								variant: "ghost",
								className: "w-full justify-center sm:justify-start text-white hover:bg-zinc-800 px-2 sm:px-4",
							})
						)}
					>
						<HomeIcon className='size-5 sm:mr-2' />
						<span className='hidden sm:inline'>Home</span>
					</Link>

					<SignedIn>
						<Link
							to={"/chat"}
							className={cn(
								buttonVariants({
									variant: "ghost",
									className: "w-full justify-center sm:justify-start text-white hover:bg-zinc-800 px-2 sm:px-4",
								})
							)}
						>
							<MessageCircle className='size-5 sm:mr-2' />
							<span className='hidden sm:inline'>Messages</span>
						</Link>

						{isAdmin && (
							<Link
								to={"/admin"}
								className={cn(
									buttonVariants({
										variant: "ghost",
										className: "w-full justify-center sm:justify-start text-white hover:bg-zinc-800 px-2 sm:px-4",
									})
								)}
							>
								<LayoutDashboardIcon className='size-5 sm:mr-2' />
								<span className='hidden sm:inline'>Admin</span>
							</Link>
						)}
					</SignedIn>
				</div>
			</div>

			{/* Library section */}
			<div className='flex-1 rounded-lg bg-zinc-900 p-3 sm:p-4 flex flex-col'>
				<div className='flex items-center justify-center sm:justify-between mb-4'>
					<div className='flex items-center text-white px-2'>
						<Library className='size-5 sm:mr-2' />
						<span className='hidden sm:inline'>Playlists</span>
					</div>
				</div>

				<ScrollArea className='flex-1 h-[calc(100vh-350px)]'>
					<div className='space-y-2'>
						{isLoading ? (
							<PlaylistSkeleton />
						) : (
							albums.map((album) => (
								<Link
									to={`/albums/${album._id}`}
									key={album._id}
									className='p-2 hover:bg-zinc-800 rounded-md flex items-center gap-2 sm:gap-3 group cursor-pointer'
								>
									<img
										src={album.imageUrl}
										alt='Playlist img'
										className='size-10 sm:size-12 rounded-md flex-shrink-0 object-cover'
									/>

									<div className='flex-1 min-w-0 hidden md:block'>
										<p className='font-medium truncate'>{album.title}</p>
										<p className='text-sm text-zinc-400 truncate'>Album • {album.artist}</p>
									</div>
								</Link>
							))
						)}
					</div>
				</ScrollArea>

				{/* Sign Out Button - Always visible at bottom */}
				<SignedIn>
					<div className="mt-4 pt-4 border-t border-zinc-800">
						<Button
							onClick={handleSignOut}
							variant="ghost"
							className="w-full justify-center sm:justify-start text-white hover:bg-zinc-800 px-2 sm:px-4 h-12 sm:h-10"
							size="sm"
						>
							<LogOut className="size-5 sm:mr-2" />
							<span className="text-xs sm:text-sm sm:inline">Sign Out</span>
						</Button>
					</div>
				</SignedIn>
			</div>
		</div>
	);
};
export default LeftSidebar;
