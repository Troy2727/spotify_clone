import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDuration } from "@/pages/album/AlbumPage";
import { useMusicStore } from "@/stores/useMusicStore";
import { Song } from "@/types";
import { Clock, Music } from "lucide-react";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import CoverPlayButton from "./CoverPlayButton";

const SongsTable = ({ songs, isFiltered }: { songs: Song[]; isFiltered: boolean }) => {
	const { albums, isLoading, error, deleteSong } = useMusicStore();

	if (isLoading && songs.length === 0 && !isFiltered) {
		return (
			<div className='space-y-2' aria-label='Loading songs'>
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className='h-14 animate-pulse rounded-lg bg-white/5' />
				))}
			</div>
		);
	}

	if (error && songs.length === 0 && !isFiltered) {
		return (
			<div role='alert' className='rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-sm text-red-300'>
				Couldn't load songs: {error}
			</div>
		);
	}

	if (songs.length === 0) {
		return (
			<div className='flex flex-col items-center gap-2 rounded-xl border border-dashed border-white/10 py-12 text-center'>
				<Music className='size-8 text-zinc-500' aria-hidden='true' />
				<p className='font-medium'>{isFiltered ? "No songs match your search" : "No songs yet"}</p>
				<p className='text-sm text-zinc-400'>{isFiltered ? "Try a different title or artist." : "Add your first song to get started."}</p>
			</div>
		);
	}

	const albumTitle = (albumId: string | null) => albums.find((album) => album._id === albumId)?.title ?? "Single";

	return (
		<div className='overflow-hidden rounded-xl border border-white/[0.06]'>
			<Table>
				<TableHeader>
					<TableRow className='border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.03]'>
						<TableHead className='w-10 text-right text-zinc-400'>#</TableHead>
						<TableHead className='text-zinc-400'>Title</TableHead>
						<TableHead className='hidden text-zinc-400 sm:table-cell'>Album</TableHead>
						<TableHead className='hidden w-20 text-right text-zinc-400 md:table-cell'>
							<Clock className='ml-auto size-4' aria-hidden='true' />
							<span className='sr-only'>Duration</span>
						</TableHead>
						<TableHead className='w-14'>
							<span className='sr-only'>Actions</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{songs.map((song, index) => (
						<TableRow key={song._id} className='border-white/[0.06] hover:bg-white/5'>
							<TableCell className='text-right tabular-nums text-zinc-400'>{index + 1}</TableCell>
							<TableCell>
								<div className='flex items-center gap-3'>
									<CoverPlayButton song={song} className='size-10' />
									<div className='min-w-0'>
										<p className='truncate font-medium'>{song.title}</p>
										<p className='truncate text-sm text-zinc-400'>{song.artist}</p>
									</div>
								</div>
							</TableCell>
							<TableCell className='hidden text-zinc-300 sm:table-cell'>{albumTitle(song.albumId)}</TableCell>
							<TableCell className='hidden text-right tabular-nums text-zinc-400 md:table-cell'>
								{formatDuration(song.duration)}
							</TableCell>
							<TableCell className='text-right'>
								<ConfirmDeleteDialog
									name={song.title}
									description={`This removes “${song.title}” by ${song.artist} from the catalog.`}
									onConfirm={() => deleteSong(song._id)}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
export default SongsTable;
