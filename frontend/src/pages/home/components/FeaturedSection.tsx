import { useMusicStore } from "@/stores/useMusicStore";
import FeaturedGridSkeleton from "@/components/skeletons/FeaturedGridSkeleton";
import PlayButton from "./PlayButton";
import { Button } from "@/components/ui/button";

const FeaturedSection = () => {
	const { isLoading, featuredSongs, albums, error } = useMusicStore();

	if (isLoading) return <FeaturedGridSkeleton />;

	if (error) return <p className='text-red-500 mb-4 text-lg'>{error}</p>;

	// Use a mix of albums and songs for the featured section
	const featuredItems = [...featuredSongs].slice(0, 6);

	return (
		<div className='mb-8'>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='text-xl sm:text-2xl font-bold'>Featured</h2>
				<Button variant='link' className='text-sm text-zinc-400 hover:text-white'>
					Show all
				</Button>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8'>
				{featuredItems.map((song) => (
					<div
						key={song._id}
						className='flex items-center bg-zinc-800/50 rounded-md overflow-hidden
						hover:bg-zinc-700/50 transition-colors group cursor-pointer relative'
					>
						<img
							src={song.imageUrl}
							alt={song.title}
							className='w-16 sm:w-20 h-16 sm:h-20 object-cover flex-shrink-0'
						/>
						<div className='flex-1 p-4'>
							<p className='font-medium truncate'>{song.title}</p>
							<p className='text-sm text-zinc-400 truncate'>{song.artist}</p>
						</div>
						<PlayButton song={song} />
					</div>
				))}
			</div>
		</div>
	);
};
export default FeaturedSection;
