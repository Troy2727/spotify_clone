import { Button } from "@/components/ui/button";
import { Song } from "@/types";
import PlayButton from "./PlayButton";
import SectionGridSkeleton from "./SectionGridSkeleton";

/** A titled row of square song cards ("Made For You", "Trending"). */
export default function SectionGrid({ title, songs, isLoading }: { title: string; songs: Song[]; isLoading: boolean }) {
	if (isLoading) return <SectionGridSkeleton />;

	return (
		<section className='mb-8'>
			<div className='mb-4 flex items-center justify-between'>
				<h2 className='text-xl font-bold sm:text-2xl'>{title}</h2>
				<Button variant='link' className='text-sm text-zinc-400 hover:text-white'>
					Show all
				</Button>
			</div>
			<ul className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				{songs.map((song) => (
					<li key={song._id} className='group rounded-md bg-zinc-800/40 p-4 transition-all hover:bg-zinc-700/40'>
						<div className='relative mb-4'>
							<div className='aspect-square overflow-hidden rounded-md shadow-lg'>
								<img src={song.imageUrl} alt={song.title} className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105' />
							</div>
							<PlayButton song={song} />
						</div>
						<h3 className='mb-2 truncate font-medium'>{song.title}</h3>
						<p className='truncate text-sm text-zinc-400'>{song.artist}</p>
					</li>
				))}
			</ul>
		</section>
	);
}
