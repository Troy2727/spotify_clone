import { useMusicStore } from "@/stores/useMusicStore";
import { Album } from "@/types";
import { Disc3 } from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

const AlbumsGrid = ({ albums, isFiltered }: { albums: Album[]; isFiltered: boolean }) => {
	const { deleteAlbum } = useMusicStore();

	if (albums.length === 0) {
		return (
			<div className='flex flex-col items-center gap-2 rounded-xl border border-dashed border-white/10 py-12 text-center'>
				<Disc3 className='size-8 text-zinc-500' aria-hidden='true' />
				<p className='font-medium'>{isFiltered ? "No albums match your search" : "No albums yet"}</p>
				<p className='text-sm text-zinc-400'>{isFiltered ? "Try a different title or artist." : "Add your first album to get started."}</p>
			</div>
		);
	}

	return (
		<ul className='grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4'>
			{albums.map((album) => (
				<li
					key={album._id}
					className='group relative rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 transition-colors hover:bg-white/[0.07]'
				>
					<Link
						to={`/albums/${album._id}`}
						className='block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500'
					>
						<img src={album.imageUrl} alt='' className='aspect-square w-full rounded-lg object-cover shadow-lg shadow-black/40' />
						<h3 className='mt-3 truncate font-semibold'>{album.title}</h3>
						<p className='truncate text-sm text-zinc-400'>{album.artist}</p>
						<p className='mt-1 text-xs text-zinc-400'>
							{album.releaseYear} · {album.songs.length} {album.songs.length === 1 ? "song" : "songs"}
						</p>
					</Link>
					<div className='absolute right-5 top-5 transition-opacity sm:opacity-0 sm:focus-within:opacity-100 sm:group-hover:opacity-100'>
						<ConfirmDeleteDialog
							name={album.title}
							description={`This removes “${album.title}” and its ${album.songs.length} ${
								album.songs.length === 1 ? "song" : "songs"
							} from the catalog.`}
							onConfirm={() => deleteAlbum(album._id)}
							triggerClassName='bg-black/60 text-white backdrop-blur hover:bg-red-500 hover:text-white'
						/>
					</div>
				</li>
			))}
		</ul>
	);
};
export default AlbumsGrid;
