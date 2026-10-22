import { useEffect } from "react";
import Topbar from "@/components/Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import RecommendedPlaylists from "./components/RecommendedPlaylists";
import SectionGrid from "./components/SectionGrid";

function greeting(hour = new Date().getHours()) {
	if (hour < 12) return "Good morning";
	if (hour < 18) return "Good afternoon";
	return "Good evening";
}

export default function HomePage() {
	const { fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs, isLoading, featuredSongs, madeForYouSongs, trendingSongs } =
		useMusicStore();
	const initializeQueue = usePlayerStore((s) => s.initializeQueue);

	useEffect(() => {
		fetchFeaturedSongs();
		fetchMadeForYouSongs();
		fetchTrendingSongs();
	}, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

	// Once every section has loaded, queue all of it so Next/Previous move through the page.
	useEffect(() => {
		if (featuredSongs.length && madeForYouSongs.length && trendingSongs.length) {
			initializeQueue([...featuredSongs, ...madeForYouSongs, ...trendingSongs]);
		}
	}, [initializeQueue, featuredSongs, madeForYouSongs, trendingSongs]);

	return (
		<main className='glass-panel relative isolate flex h-full flex-col overflow-hidden rounded-md'>
			<div aria-hidden className='ambient-band pointer-events-none absolute inset-x-0 top-0 -z-10 h-80' />
			<Topbar />
			<ScrollArea className='min-h-0 flex-1'>
				<div className='p-4 sm:p-6'>
					<h1 className='mb-6 text-2xl font-bold sm:text-3xl'>{greeting()}</h1>
					<RecommendedPlaylists />
					<div className='space-y-8'>
						<SectionGrid title='Made For You' songs={madeForYouSongs} isLoading={isLoading} />
						<SectionGrid title='Trending' songs={trendingSongs} isLoading={isLoading} />
					</div>
				</div>
			</ScrollArea>
		</main>
	);
}
