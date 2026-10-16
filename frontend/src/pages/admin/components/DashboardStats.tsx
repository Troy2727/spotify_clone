import { useMusicStore } from "@/stores/useMusicStore";
import { Disc3, ListMusic, Mic2, Users2 } from "lucide-react";
import StatsCard from "./StatsCard";

const DashboardStats = () => {
	const { songs, albums, stats } = useMusicStore();

	// counted from the loaded catalog so adds/deletes show up immediately; users come from the server
	const albumTracks = songs.filter((song) => song.albumId).length;
	const artists = new Set([...songs, ...albums].map((item) => item.artist)).size;
	const tracksInAlbums = albums.reduce((total, album) => total + album.songs.length, 0);

	return (
		<div className='grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4'>
			<StatsCard
				icon={ListMusic}
				label='Songs'
				value={songs.length.toLocaleString()}
				caption={`${songs.length - albumTracks} singles · ${albumTracks} album tracks`}
				accent='emerald'
			/>
			<StatsCard
				icon={Disc3}
				label='Albums'
				value={albums.length.toLocaleString()}
				caption={`${tracksInAlbums} tracks across albums`}
				accent='violet'
			/>
			<StatsCard icon={Mic2} label='Artists' value={artists.toLocaleString()} caption='Unique across the catalog' accent='orange' />
			<StatsCard
				icon={Users2}
				label='Users'
				value={stats.totalUsers.toLocaleString()}
				caption='Signed up with Clerk'
				accent='sky'
			/>
		</div>
	);
};
export default DashboardStats;
