import { SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const Topbar = () => {
	const { isAdmin } = useAuthStore();
	console.log({ isAdmin });

	return (
		<div
			className='flex items-center justify-between p-2 sm:p-4 sticky top-0 bg-zinc-900/75
      backdrop-blur-md z-10
    '
		>
			<div className='flex gap-1 sm:gap-2 items-center'>
				<img src='/spotify.png' className='size-6 sm:size-8' alt='Spotify logo' />
				<span className="font-medium text-sm sm:text-base">Spotify</span>
			</div>
			<div className='flex items-center gap-1 sm:gap-4'>
				{isAdmin && (
					<Link
						to={"/admin"}
						className={cn(
							buttonVariants({ variant: "outline", size: "sm" }),
							"hidden sm:flex sm:items-center text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
						)}
					>
						<LayoutDashboardIcon className='size-3 sm:size-4 mr-1 sm:mr-2' />
						Admin Dashboard
					</Link>
				)}

				{isAdmin && (
					<Link
						to={"/admin"}
						className={cn(
							buttonVariants({ variant: "outline", size: "sm" }),
							"sm:hidden flex items-center justify-center w-8 h-8 p-0"
						)}
					>
						<LayoutDashboardIcon className='size-4' />
					</Link>
				)}

				<SignedOut>
					<div className="flex items-center">
						<SignInOAuthButtons />
					</div>
				</SignedOut>

				<UserButton />
			</div>
		</div>
	);
};
export default Topbar;
