import { useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/lib/axios";

/** After Google sign-in: save the Clerk user in our database (once), then go home. */
export default function AuthCallbackPage() {
	const { isLoaded, user } = useUser();
	const navigate = useNavigate();
	const synced = useRef(false); // StrictMode runs effects twice in development

	useEffect(() => {
		if (!isLoaded || !user || synced.current) return;
		synced.current = true;
		axiosInstance
			.post("/auth/callback", { id: user.id, firstName: user.firstName, lastName: user.lastName, imageUrl: user.imageUrl })
			.catch((error) => console.error("Saving the signed-in user failed:", error))
			.finally(() => navigate("/"));
	}, [isLoaded, user, navigate]);

	return (
		<div className='flex h-screen w-full items-center justify-center bg-black'>
			<Card className='w-[90%] max-w-md border-zinc-800 bg-zinc-900'>
				<CardContent role='status' className='flex flex-col items-center gap-4 pt-6'>
					<Loader className='size-6 animate-spin text-emerald-500' />
					<h3 className='text-xl font-bold text-zinc-400'>Signing you in</h3>
					<p className='text-sm text-zinc-400'>One moment...</p>
				</CardContent>
			</Card>
		</div>
	);
}
