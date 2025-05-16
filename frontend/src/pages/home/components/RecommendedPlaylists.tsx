import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const RecommendedPlaylists = () => {
	const { isLoading, featuredSongs } = useMusicStore();
	const { setCurrentSong } = usePlayerStore();

	// Create playlist data to match the second screenshot
	const playlists = [
		{
			id: 1,
			title: "Stay With Me",
			artist: "Sarah Mitchell",
			imageUrl: "/cover-images/1.jpg",
		},
		{
			id: 2,
			title: "Urban Jungle",
			artist: "City Lights",
			imageUrl: "/cover-images/15.jpg",
		},
		{
			id: 3,
			title: "Lost in Tokyo",
			artist: "Electric Dreams",
			imageUrl: "/cover-images/3.jpg",
		},
		{
			id: 4,
			title: "Neon Tokyo",
			artist: "Future Pulse",
			imageUrl: "/cover-images/5.jpg",
		},
		{
			id: 5,
			title: "Moonlight Dance",
			artist: "Silver Shadows",
			imageUrl: "/cover-images/14.jpg",
		},
		{
			id: 6,
			title: "Crystal Rain",
			artist: "Echo Valley",
			imageUrl: "/cover-images/9.jpg",
		},
	];

	if (isLoading) {
		return (
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="bg-zinc-800/50 rounded-md h-20 animate-pulse" />
				))}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
			{playlists.map((playlist) => (
				<div
					key={playlist.id}
					className="flex items-center bg-zinc-800/50 rounded-md overflow-hidden
					hover:bg-zinc-700/50 transition-colors group cursor-pointer relative"
				>
					<img
						src={playlist.imageUrl}
						alt={playlist.title}
						className="w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0"
					/>
					<div className="flex-1 p-4">
						<p className="font-medium truncate">{playlist.title}</p>
						<p className="text-sm text-zinc-400 truncate">{playlist.artist}</p>
					</div>
					<Button
						size="icon"
						className="absolute bottom-3 right-2 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all
						opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100"
						onClick={() => {
							if (featuredSongs.length > 0) {
								setCurrentSong(featuredSongs[0]);
							}
						}}
					>
						<Play className="size-5 text-black" />
					</Button>
				</div>
			))}
		</div>
	);
};

export default RecommendedPlaylists;
