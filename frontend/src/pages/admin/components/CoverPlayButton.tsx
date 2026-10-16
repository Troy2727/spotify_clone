import { cn } from "@/lib/utils";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Song } from "@/types";
import { Pause, Play } from "lucide-react";

// Song cover that plays/pauses the song (overlay shows on hover/focus, or while it's playing)
const CoverPlayButton = ({ song, className }: { song: Song; className?: string }) => {
	const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
	const isCurrent = currentSong?._id === song._id;
	const isActive = isCurrent && isPlaying;

	return (
		<button
			type='button'
			onClick={() => (isCurrent ? togglePlay() : setCurrentSong(song))}
			aria-label={`${isActive ? "Pause" : "Play"} ${song.title}`}
			className={cn(
				"group/cover relative shrink-0 overflow-hidden rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500",
				className
			)}
		>
			<img src={song.imageUrl} alt='' className='size-full object-cover' />
			<span
				className={cn(
					"absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity",
					isActive ? "opacity-100" : "opacity-0 group-hover/cover:opacity-100 group-focus-visible/cover:opacity-100"
				)}
			>
				{isActive ? <Pause className='size-4 fill-white text-white' /> : <Play className='size-4 fill-white text-white' />}
			</span>
		</button>
	);
};

export default CoverPlayButton;
