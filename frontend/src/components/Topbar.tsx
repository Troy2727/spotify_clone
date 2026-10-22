import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { userButtonAppearance } from "@/lib/clerkAppearance";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { buttonVariants } from "./ui/button";

/** Sticky bar at the top of a page: logo, admin shortcut, sign-in or the account menu. */
export default function Topbar() {
	const { isAdmin } = useAuthStore();

	return (
		<header className='sticky top-0 z-10 flex items-center justify-between bg-zinc-900/75 p-2 backdrop-blur-md sm:p-4'>
			<div className='flex items-center gap-1 sm:gap-2'>
				<img src='/spotify.png' alt='' className='size-6 sm:size-8' />
				<span className='text-sm font-medium sm:text-base'>Spotify</span>
			</div>
			<div className='flex items-center gap-1 sm:gap-4'>
				{isAdmin && (
					<Link
						to='/admin'
						aria-label='Admin Dashboard'
						className={cn(
							buttonVariants({ variant: "outline", size: "sm" }),
							"flex h-8 w-8 items-center justify-center p-0 text-xs sm:h-10 sm:w-auto sm:px-4 sm:text-sm",
						)}
					>
						<LayoutDashboardIcon className='size-4 sm:mr-2' />
						<span className='hidden sm:inline'>Admin Dashboard</span>
					</Link>
				)}
				<SignedOut>
					<SignInOAuthButtons />
				</SignedOut>
				<UserButton appearance={userButtonAppearance} />
			</div>
		</header>
	);
}
