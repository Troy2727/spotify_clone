import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Song } from "@/types";

/** Green play/pause button that appears on card hover; stays visible for the song that's loaded. */
export default function PlayButton({ song }: { song: Song }) {
	const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
	const isLoaded = currentSong?._id === song._id;
	const showPause = isLoaded && isPlaying;

	return (
		<Button
			size='icon'
			aria-label={`${showPause ? "Pause" : "Play"} ${song.title}`}
			onClick={() => (isLoaded ? togglePlay() : setCurrentSong(song))}
			className={`absolute bottom-3 right-2 translate-y-2 bg-green-500 transition-all hover:scale-105 hover:bg-green-400 group-hover:translate-y-0 ${
				isLoaded ? "opacity-100" : "opacity-0 group-hover:opacity-100"
			}`}
		>
			{showPause ? <Pause className='size-5 text-black' /> : <Play className='size-5 text-black' />}
		</Button>
	);
}
