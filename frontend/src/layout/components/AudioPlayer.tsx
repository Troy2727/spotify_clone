import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/stores/usePlayerStore";

/**
 * The one <audio> element for the whole app. It follows the player store:
 * loads the current song, plays or pauses, and moves to the next song when one ends.
 */
export default function AudioPlayer() {
	const audioRef = useRef<HTMLAudioElement>(null);
	const loadedUrl = useRef<string | null>(null);
	const { currentSong, isPlaying, playNext } = usePlayerStore();

	// Load a new song from the start (but not when the same song is re-selected).
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !currentSong || currentSong.audioUrl === loadedUrl.current) return;
		audio.src = currentSong.audioUrl;
		audio.currentTime = 0;
		loadedUrl.current = currentSong.audioUrl;
		if (isPlaying) audio.play();
	}, [currentSong, isPlaying]);

	useEffect(() => {
		if (isPlaying) audioRef.current?.play();
		else audioRef.current?.pause();
	}, [isPlaying]);

	useEffect(() => {
		const audio = audioRef.current;
		audio?.addEventListener("ended", playNext);
		return () => audio?.removeEventListener("ended", playNext);
	}, [playNext]);

	// crossOrigin lets the waveform analyser read songs served from other origins (e.g. Cloudinary).
	return <audio ref={audioRef} crossOrigin='anonymous' />;
}
