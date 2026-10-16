import { useMusicStore } from "@/stores/useMusicStore";
import { useState } from "react";
import AddAlbumDialog from "./AddAlbumDialog";
import AlbumsGrid from "./AlbumsGrid";
import SearchInput from "./SearchInput";

const AlbumsTabContent = () => {
	const { albums } = useMusicStore();
	const [query, setQuery] = useState("");

	const q = query.trim().toLowerCase();
	const filtered = q ? albums.filter((album) => `${album.title} ${album.artist}`.toLowerCase().includes(q)) : albums;

	return (
		<section aria-label='Albums' className='space-y-4'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
				<SearchInput value={query} onChange={setQuery} label='Search albums' placeholder='Search albums or artists' />
				<p className='text-sm text-zinc-400 sm:ml-auto' aria-live='polite'>
					{filtered.length} of {albums.length} albums
				</p>
				<AddAlbumDialog />
			</div>
			<AlbumsGrid albums={filtered} isFiltered={q.length > 0} />
		</section>
	);
};
export default AlbumsTabContent;
