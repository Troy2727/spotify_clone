import { SignedIn, useClerk } from "@clerk/clerk-react";
import { HomeIcon, LayoutDashboardIcon, Library, LogOut, type LucideIcon, MessageCircle } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMusicStore } from "@/stores/useMusicStore";

const rowStyle = "w-full justify-center px-2 text-white hover:bg-zinc-800 sm:justify-start sm:px-4";

/** On narrow screens only the icon shows; the label appears from `sm` up. */
function NavLink({ to, icon: Icon, label }: { to: string; icon: LucideIcon; label: string }) {
	return (
		<Link to={to} aria-label={label} className={cn(buttonVariants({ variant: "ghost" }), rowStyle)}>
			<Icon className='size-5 sm:mr-2' />
			<span className='hidden sm:inline'>{label}</span>
		</Link>
	);
}

/** Left column: navigation, the album library, and sign-out. */
export default function LeftSidebar() {
	const { albums, fetchAlbums, isLoading } = useMusicStore();
	const { isAdmin } = useAuthStore();
	const { signOut } = useClerk();

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);

	return (
		<div className='flex h-full flex-col gap-2'>
			<nav className='glass-panel space-y-2 rounded-lg p-3 sm:p-4'>
				<NavLink to='/' icon={HomeIcon} label='Home' />
				<SignedIn>
					<NavLink to='/chat' icon={MessageCircle} label='Messages' />
					{isAdmin && <NavLink to='/admin' icon={LayoutDashboardIcon} label='Admin' />}
				</SignedIn>
			</nav>

			<section className='glass-panel flex flex-1 flex-col rounded-lg p-3 sm:p-4'>
				<h2 className='mb-4 flex items-center justify-center px-2 text-white sm:justify-start'>
					<Library className='size-5 sm:mr-2' />
					<span className='hidden sm:inline'>Playlists</span>
				</h2>

				<ScrollArea className='h-[calc(100vh-350px)] flex-1'>
					<div className='space-y-2'>
						{isLoading ? (
							<PlaylistSkeleton />
						) : (
							albums.map((album) => (
								<Link key={album._id} to={`/albums/${album._id}`} className='group flex items-center gap-2 rounded-md p-2 hover:bg-zinc-800 sm:gap-3'>
									<img src={album.imageUrl} alt={album.title} className='size-10 flex-shrink-0 rounded-md object-cover sm:size-12' />
									<div className='hidden min-w-0 flex-1 md:block'>
										<p className='truncate font-medium'>{album.title}</p>
										<p className='truncate text-sm text-zinc-400'>Album • {album.artist}</p>
									</div>
								</Link>
							))
						)}
					</div>
				</ScrollArea>

				<SignedIn>
					<div className='mt-4 border-t border-zinc-800 pt-4'>
						<Button onClick={() => signOut()} variant='ghost' size='sm' className={cn(rowStyle, "h-12 sm:h-10")}>
							<LogOut className='size-5 sm:mr-2' />
							<span className='text-xs sm:text-sm'>Sign Out</span>
						</Button>
					</div>
				</SignedIn>
			</section>
		</div>
	);
}
