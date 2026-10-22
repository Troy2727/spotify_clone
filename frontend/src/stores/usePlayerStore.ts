import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
	currentSong: Song | null;
	isPlaying: boolean;
	queue: Song[];
	currentIndex: number;

	initializeQueue: (songs: Song[]) => void;
	playAlbum: (songs: Song[], startIndex?: number) => void;
	setCurrentSong: (song: Song | null) => void;
	togglePlay: () => void;
	playNext: () => void;
	playPrevious: () => void;
}

/** Tell friends what we're listening to (the Friends Activity sidebar). */
function shareActivity(song: Song | null) {
	const socket = useChatStore.getState().socket;
	if (!socket.auth) return; // not connected to chat
	socket.emit("update_activity", {
		userId: (socket.auth as { userId: string }).userId,
		activity: song ? `Playing ${song.title} by ${song.artist}` : "Idle",
	});
}

export const usePlayerStore = create<PlayerStore>((set, get) => {
	/** Start playing the queue entry at `index`, or stop if there isn't one. */
	const playAt = (index: number) => {
		const song = get().queue[index];
		if (!song) {
			set({ isPlaying: false });
			shareActivity(null);
			return;
		}
		set({ currentSong: song, currentIndex: index, isPlaying: true });
		shareActivity(song);
	};

	return {
		currentSong: null,
		isPlaying: false,
		queue: [],
		currentIndex: -1,

		// Load songs as the queue without interrupting whatever is already selected.
		initializeQueue: (songs) =>
			set((state) => ({
				queue: songs,
				currentSong: state.currentSong ?? songs[0],
				currentIndex: state.currentIndex === -1 ? 0 : state.currentIndex,
			})),

		playAlbum: (songs, startIndex = 0) => {
			if (songs.length === 0) return;
			set({ queue: songs });
			playAt(startIndex);
		},

		setCurrentSong: (song) => {
			if (!song) return;
			const index = get().queue.findIndex((s) => s._id === song._id);
			set((state) => ({ currentSong: song, isPlaying: true, currentIndex: index === -1 ? state.currentIndex : index }));
			shareActivity(song);
		},

		togglePlay: () => {
			const playing = !get().isPlaying;
			set({ isPlaying: playing });
			shareActivity(playing ? get().currentSong : null);
		},

		playNext: () => playAt(get().currentIndex + 1),
		playPrevious: () => playAt(get().currentIndex - 1),
	};
});
