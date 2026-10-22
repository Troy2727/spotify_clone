import { useMusicStore } from "@/stores/useMusicStore";
import PlayButton from "./PlayButton";

const GRID = "mb-8 grid grid-cols-1 gap-2 xs:grid-cols-2 sm:gap-4 md:grid-cols-3";

/** Six compact cards of featured songs at the top of the home page. */
export default function RecommendedPlaylists() {
	const { isLoading, featuredSongs } = useMusicStore();

	if (isLoading) {
		return (
			<div className={GRID} aria-busy>
				{Array.from({ length: 6 }, (_, i) => (
					<div key={i} className='h-20 animate-pulse rounded-md bg-zinc-800/50' />
				))}
			</div>
		);
	}

	return (
		<ul className={GRID}>
			{featuredSongs.slice(0, 6).map((song) => (
				<li
					key={song._id}
					className='group relative flex items-center overflow-hidden rounded-md bg-zinc-800/50 transition-colors hover:bg-zinc-700/50'
				>
					<img src={song.imageUrl} alt={song.title} className='h-12 w-12 flex-shrink-0 object-cover sm:h-20 sm:w-20' />
					<div className='min-w-0 flex-1 px-2 sm:p-4'>
						<p className='truncate font-medium'>{song.title}</p>
						<p className='truncate text-sm text-zinc-400'>{song.artist}</p>
					</div>
					<PlayButton song={song} />
				</li>
			))}
		</ul>
	);
}
