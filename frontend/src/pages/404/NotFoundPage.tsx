import { Disc3, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
	const navigate = useNavigate();

	return (
		<main className='flex h-full items-center justify-center rounded-lg bg-neutral-900/80'>
			<div className='space-y-8 px-4 text-center'>
				<Disc3 className='mx-auto h-24 w-24 animate-spin text-emerald-500 [animation-duration:3s]' aria-hidden />
				<div className='space-y-4'>
					<h1 className='text-7xl font-bold text-white'>404</h1>
					<h2 className='text-2xl font-semibold text-white'>Nothing playing here</h2>
					<p className='mx-auto max-w-md text-neutral-400'>This page doesn't exist. Head back home and pick something to listen to.</p>
				</div>
				<div className='mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row'>
					<Button onClick={() => navigate(-1)} variant='outline' className='w-full border-neutral-700 bg-neutral-800 text-white hover:bg-neutral-700 sm:w-auto'>
						Go Back
					</Button>
					<Button onClick={() => navigate("/")} className='w-full bg-emerald-500 text-white hover:bg-emerald-600 sm:w-auto'>
						<Home className='mr-2 h-4 w-4' />
						Back to Home
					</Button>
				</div>
			</div>
		</main>
	);
}
