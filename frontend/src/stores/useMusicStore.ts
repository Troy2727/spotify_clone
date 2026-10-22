import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { isDemoMode } from "@/lib/demoMode";
import { FALLBACK_ALBUMS, FALLBACK_FEATURED, FALLBACK_MADE_FOR_YOU, FALLBACK_TRENDING } from "@/lib/fallbackCatalog";
import { Album, Song, Stats } from "@/types";

// The live demo has no database, so admin edits there are kept for the session only.
// They live outside the store and are re-applied after every fetch, so refetching
// (switching tabs, revisiting a page) doesn't undo them.
const demo = { songs: [] as Song[], albums: [] as Album[], deleted: new Set<string>() };

const withDemoSongs = (songs: Song[]) => [...demo.songs, ...songs].filter((s) => !demo.deleted.has(s._id));

const withDemoAlbums = (albums: Album[]) =>
	[...demo.albums, ...albums]
		.filter((a) => !demo.deleted.has(a._id))
		.map((a) => ({
			...a,
			songs: [...a.songs, ...demo.songs.filter((s) => s.albumId === a._id)].filter((s) => !demo.deleted.has(s._id)),
		}));

const message = (error: unknown) => (error as { message?: string })?.message ?? "Request failed";

interface MusicStore {
	songs: Song[];
	albums: Album[];
	isLoading: boolean;
	error: string | null;
	currentAlbum: Album | null;
	featuredSongs: Song[];
	madeForYouSongs: Song[];
	trendingSongs: Song[];
	stats: Stats;

	fetchAlbums: () => Promise<void>;
	fetchAlbumById: (id: string) => Promise<void>;
	fetchFeaturedSongs: () => Promise<void>;
	fetchMadeForYouSongs: () => Promise<void>;
	fetchTrendingSongs: () => Promise<void>;
	fetchStats: () => Promise<void>;
	fetchSongs: () => Promise<void>;
	deleteSong: (id: string) => Promise<void>;
	deleteAlbum: (id: string) => Promise<void>;
	addDemoSong: (song: Song) => void;
	addDemoAlbum: (album: Album) => void;
}

type Lists = Pick<MusicStore, "songs" | "albums" | "featuredSongs" | "madeForYouSongs" | "trendingSongs">;

export const useMusicStore = create<MusicStore>((set, get) => {
	/**
	 * GET `url` into `key`. If it fails and a fallback is given, show the fallback
	 * instead (the error is only surfaced in development, so visitors never see it).
	 */
	async function load<K extends keyof Lists>(key: K, url: string, fallback?: Lists[K], adjust = (v: Lists[K]) => v) {
		set({ isLoading: true, error: null });
		try {
			const { data } = await axiosInstance.get(url);
			set({ [key]: adjust(data) } as Partial<MusicStore>);
		} catch (error) {
			console.error(`Loading ${url} failed:`, error);
			if (!fallback) set({ error: message(error) });
			else {
				set({ [key]: adjust(fallback) } as Partial<MusicStore>);
				if (import.meta.env.DEV) set({ error: `Could not load ${url}; showing fallback data.` });
			}
		} finally {
			set({ isLoading: false });
		}
	}

	/** Run a delete (real or demo), then report the outcome as a toast. */
	async function remove(work: () => Promise<void> | void, done: string, failed: (e: unknown) => string) {
		set({ isLoading: true, error: null });
		try {
			await work();
			toast.success(isDemoMode() ? `${done} (demo, resets on reload)` : `${done} successfully`);
		} catch (error) {
			console.error(failed(error), error);
			toast.error(failed(error));
		} finally {
			set({ isLoading: false });
		}
	}

	return {
		songs: [],
		albums: [],
		isLoading: false,
		error: null,
		currentAlbum: null,
		featuredSongs: [],
		madeForYouSongs: [],
		trendingSongs: [],
		stats: { totalSongs: 0, totalAlbums: 0, totalUsers: 0, totalArtists: 0 },

		fetchSongs: () => load("songs", "/songs", undefined, (s) => (isDemoMode() ? withDemoSongs(s) : s)),
		fetchAlbums: () => load("albums", "/albums", FALLBACK_ALBUMS, (a) => (isDemoMode() ? withDemoAlbums(a) : a)),
		fetchFeaturedSongs: () => load("featuredSongs", "/songs/featured", FALLBACK_FEATURED),
		fetchMadeForYouSongs: () => load("madeForYouSongs", "/songs/made-for-you", FALLBACK_MADE_FOR_YOU),
		fetchTrendingSongs: () => load("trendingSongs", "/songs/trending", FALLBACK_TRENDING),

		fetchStats: async () => {
			set({ isLoading: true, error: null });
			try {
				set({ stats: (await axiosInstance.get("/stats")).data });
			} catch (error) {
				set({ error: message(error) });
			} finally {
				set({ isLoading: false });
			}
		},

		fetchAlbumById: async (id) => {
			set({ isLoading: true, error: null });
			try {
				if (isDemoMode()) {
					// Albums created in the demo exist only in this session.
					const local = withDemoAlbums([]).find((a) => a._id === id);
					if (local) return set({ currentAlbum: local });
					if (demo.deleted.has(id)) return set({ currentAlbum: null, error: "Album not found" });
				}
				const { data } = await axiosInstance.get(`/albums/${id}`);
				set({ currentAlbum: isDemoMode() ? withDemoAlbums([data])[0] : data });
			} catch (error) {
				const response = (error as { response?: { data?: { message?: string } } }).response;
				set({ error: response?.data?.message ?? message(error) });
			} finally {
				set({ isLoading: false });
			}
		},

		addDemoSong: (song) => {
			demo.songs.unshift(song);
			set((state) => ({
				songs: [song, ...state.songs],
				albums: state.albums.map((a) => (a._id === song.albumId ? { ...a, songs: [...a.songs, song] } : a)),
			}));
		},

		addDemoAlbum: (album) => {
			demo.albums.unshift(album);
			set((state) => ({ albums: [album, ...state.albums] }));
		},

		deleteSong: (id) =>
			remove(
				async () => {
					if (isDemoMode()) demo.deleted.add(id);
					else await axiosInstance.delete(`/admin/songs/${id}`);
					set((state) => ({
						songs: state.songs.filter((s) => s._id !== id),
						albums: state.albums.map((a) => ({ ...a, songs: a.songs.filter((s) => s._id !== id) })),
					}));
				},
				"Song deleted",
				() => "Error deleting song",
			),

		deleteAlbum: (id) =>
			remove(
				async () => {
					if (isDemoMode()) {
						demo.deleted.add(id);
						get().songs.filter((s) => s.albumId === id).forEach((s) => demo.deleted.add(s._id));
					} else {
						await axiosInstance.delete(`/admin/albums/${id}`);
					}
					// The backend deletes an album together with its songs; mirror that here.
					set((state) => ({
						albums: state.albums.filter((a) => a._id !== id),
						songs: state.songs.filter((s) => s.albumId !== id),
					}));
				},
				"Album deleted",
				(e) => `Failed to delete album: ${message(e)}`,
			),
	};
});
