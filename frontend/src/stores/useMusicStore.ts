import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

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
}

export const useMusicStore = create<MusicStore>((set) => ({
	albums: [],
	songs: [],
	isLoading: false,
	error: null,
	currentAlbum: null,
	madeForYouSongs: [],
	featuredSongs: [],
	trendingSongs: [],
	stats: {
		totalSongs: 0,
		totalAlbums: 0,
		totalUsers: 0,
		totalArtists: 0,
	},

	deleteSong: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/songs/${id}`);

			set((state) => ({
				songs: state.songs.filter((song) => song._id !== id),
			}));
			toast.success("Song deleted successfully");
		} catch (error: any) {
			console.log("Error in deleteSong", error);
			toast.error("Error deleting song");
		} finally {
			set({ isLoading: false });
		}
	},

	deleteAlbum: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/albums/${id}`);
			set((state) => ({
				albums: state.albums.filter((album) => album._id !== id),
				songs: state.songs.map((song) =>
					song.albumId === state.albums.find((a) => a._id === id)?.title ? { ...song, album: null } : song
				),
			}));
			toast.success("Album deleted successfully");
		} catch (error: any) {
			toast.error("Failed to delete album: " + error.message);
		} finally {
			set({ isLoading: false });
		}
	},

	fetchSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs");
			set({ songs: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchStats: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/stats");
			set({ stats: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbums: async () => {
		set({ isLoading: true, error: null });

		try {
			const response = await axiosInstance.get("/albums");
			set({ albums: response.data });
		} catch (error: any) {
			console.error("Error fetching albums:", error);
			// Don't show error message to user for API failures in production
			if (import.meta.env.DEV) {
				set({ error: error.message || "Failed to fetch albums" });
			}
			// Use fallback data if API fails
			const fallbackAlbums = [
				{
					_id: "album1",
					title: "Urban Nights",
					artist: "Various Artists",
					imageUrl: "/cover-images/15.jpg",
					releaseYear: 2023,
					songs: []
				},
				{
					_id: "album2",
					title: "Coastal Dreaming",
					artist: "Various Artists",
					imageUrl: "/cover-images/9.jpg",
					releaseYear: 2022,
					songs: []
				},
				{
					_id: "album3",
					title: "Midnight Sessions",
					artist: "Various Artists",
					imageUrl: "/cover-images/10.jpg",
					releaseYear: 2023,
					songs: []
				},
				{
					_id: "album4",
					title: "Eastern Dreams",
					artist: "Various Artists",
					imageUrl: "/cover-images/3.jpg",
					releaseYear: 2021,
					songs: []
				}
			];
			// Set the fallback data without showing an error in production
			set({ albums: fallbackAlbums });
			if (import.meta.env.DEV) {
				set({ error: "Could not fetch albums. Using fallback data." });
			}
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbumById: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/albums/${id}`);
			set({ currentAlbum: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchFeaturedSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/featured");
			set({ featuredSongs: response.data });
		} catch (error: any) {
			console.error("Error fetching featured songs:", error);
			// Don't show error message to user for API failures in production
			if (import.meta.env.DEV) {
				set({ error: error.message || "Failed to fetch featured songs" });
			}
			// Use fallback data if API fails
			const fallbackSongs = [
				{
					_id: "featured1",
					title: "Stay With Me",
					artist: "Sarah Mitchell",
					imageUrl: "/cover-images/1.jpg",
					audioUrl: "/songs/1.mp3",
					duration: 180,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				},
				{
					_id: "featured2",
					title: "Urban Jungle",
					artist: "City Lights",
					imageUrl: "/cover-images/15.jpg",
					audioUrl: "/songs/2.mp3",
					duration: 210,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				},
				{
					_id: "featured3",
					title: "Lost in Tokyo",
					artist: "Electric Dreams",
					imageUrl: "/cover-images/3.jpg",
					audioUrl: "/songs/3.mp3",
					duration: 195,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				},
				{
					_id: "featured4",
					title: "Neon Tokyo",
					artist: "Future Pulse",
					imageUrl: "/cover-images/5.jpg",
					audioUrl: "/songs/4.mp3",
					duration: 225,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				},
				{
					_id: "featured5",
					title: "Moonlight Dance",
					artist: "Silver Shadows",
					imageUrl: "/cover-images/14.jpg",
					audioUrl: "/songs/5.mp3",
					duration: 240,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				},
				{
					_id: "featured6",
					title: "Crystal Rain",
					artist: "Echo Valley",
					imageUrl: "/cover-images/9.jpg",
					audioUrl: "/songs/6.mp3",
					duration: 200,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				}
			];
			// Set the fallback data without showing an error in production
			set({ featuredSongs: fallbackSongs });
			if (import.meta.env.DEV) {
				set({ error: "Could not fetch featured songs. Using fallback data." });
			}
		} finally {
			set({ isLoading: false });
		}
	},

	fetchMadeForYouSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/made-for-you");
			set({ madeForYouSongs: response.data });
		} catch (error: any) {
			console.error("Error fetching made-for-you songs:", error);
			// Don't show error message to user for API failures in production
			if (import.meta.env.DEV) {
				set({ error: error.message || "Failed to fetch made-for-you songs" });
			}
			// Use fallback data if API fails
			const fallbackSongs = [
				{
					_id: "mfy1",
					title: "Starboy",
					artist: "The Weeknd",
					imageUrl: "/cover-images/4.jpg",
					audioUrl: "/songs/7.mp3",
					duration: 230,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				},
				{
					_id: "mfy2",
					title: "Enemy",
					artist: "Imagine Dragons & JID",
					imageUrl: "/cover-images/6.jpg",
					audioUrl: "/songs/8.mp3",
					duration: 215,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				},
				{
					_id: "mfy3",
					title: "Yeah!",
					artist: "Usher",
					imageUrl: "/cover-images/7.jpg",
					audioUrl: "/songs/9.mp3",
					duration: 250,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				},
				{
					_id: "mfy4",
					title: "Shape of You",
					artist: "Ed Sheeran",
					imageUrl: "/cover-images/8.jpg",
					audioUrl: "/songs/10.mp3",
					duration: 235,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				}
			];
			// Set the fallback data without showing an error in production
			set({ madeForYouSongs: fallbackSongs });
			if (import.meta.env.DEV) {
				set({ error: "Could not fetch made-for-you songs. Using fallback data." });
			}
		} finally {
			set({ isLoading: false });
		}
	},

	fetchTrendingSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/songs/trending");
			set({ trendingSongs: response.data });
		} catch (error: any) {
			console.error("Error fetching trending songs:", error);
			// Don't show error message to user for API failures in production
			if (import.meta.env.DEV) {
				set({ error: error.message || "Failed to fetch trending songs" });
			}
			// Use fallback data if API fails
			const fallbackSongs = [
				{
					_id: "trending1",
					title: "Midnight Drive",
					artist: "The Weekenders",
					imageUrl: "/cover-images/10.jpg",
					audioUrl: "/songs/1.mp3",
					duration: 240,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				},
				{
					_id: "trending2",
					title: "Starlight",
					artist: "Luna Ray",
					imageUrl: "/cover-images/11.jpg",
					audioUrl: "/songs/2.mp3",
					duration: 195,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				},
				{
					_id: "trending3",
					title: "City Rain",
					artist: "Urban Lofi",
					imageUrl: "/cover-images/12.jpg",
					audioUrl: "/songs/3.mp3",
					duration: 210,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				},
				{
					_id: "trending4",
					title: "Neon Lights",
					artist: "Night Express",
					imageUrl: "/cover-images/13.jpg",
					audioUrl: "/songs/4.mp3",
					duration: 225,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				}
			];
			// Set the fallback data without showing an error in production
			set({ trendingSongs: fallbackSongs });
			if (import.meta.env.DEV) {
				set({ error: "Could not fetch trending songs. Using fallback data." });
			}
		} finally {
			set({ isLoading: false });
		}
	},
}));
