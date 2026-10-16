import { useMusicStore } from "@/stores/useMusicStore";
import { useState } from "react";
import AddSongDialog from "./AddSongDialog";
import SearchInput from "./SearchInput";
import SongsTable from "./SongsTable";

const SongsTabContent = () => {
	const { songs } = useMusicStore();
	const [query, setQuery] = useState("");

	const q = query.trim().toLowerCase();
	const filtered = q ? songs.filter((song) => `${song.title} ${song.artist}`.toLowerCase().includes(q)) : songs;

	return (
		<section aria-label='Songs' className='space-y-4'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
				<SearchInput value={query} onChange={setQuery} label='Search songs' placeholder='Search songs or artists' />
				<p className='text-sm text-zinc-400 sm:ml-auto' aria-live='polite'>
					{filtered.length} of {songs.length} songs
				</p>
				<AddSongDialog />
			</div>
			<SongsTable songs={filtered} isFiltered={q.length > 0} />
		</section>
	);
};
export default SongsTabContent;
