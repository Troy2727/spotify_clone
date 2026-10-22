import { Clock, Pause, Play } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDuration, formatLength as formatTotalDuration } from "@/lib/format";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";

/** Three bouncing bars marking the track that's playing. */
function Equalizer() {
	return (
		<span role='img' aria-label='Now playing' className='flex h-3.5 items-end gap-[2px]'>
			{[0, 0.25, 0.5].map((delay) => (
				<span key={delay} className='equalizer-bar h-full w-[3px] rounded-sm bg-green-500' style={{ animationDelay: `${delay}s` }} />
			))}
		</span>
	);
}

/** One album: blurred cover backdrop, header, play button and the track list. */
export default function AlbumPage() {
	const { albumId } = useParams();
	const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
	const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

	useEffect(() => {
		if (albumId) fetchAlbumById(albumId);
	}, [fetchAlbumById, albumId]);

	if (isLoading) return null;

	const songs = currentAlbum?.songs ?? [];
	const isAlbumCurrent = songs.some((song) => song._id === currentSong?._id);
	const totalDuration = songs.reduce((total, song) => total + song.duration, 0);

	// The big button pauses/resumes this album if it's playing, otherwise starts it from track 1.
	const handlePlayAlbum = () => (isAlbumCurrent ? togglePlay() : playAlbum(songs, 0));
	const handlePlaySong = (index: number) => playAlbum(songs, index);

	return (
		<div className='h-full'>
			<ScrollArea className='h-full rounded-md'>
				<div className='relative min-h-full overflow-hidden rounded-md glass-panel'>
					{/* backdrop: the album's own cover, blurred, masked so it fades into the glass panel (clipped so the blur can't bleed past the fade) */}
					<div
						className='pointer-events-none absolute inset-x-0 top-0 h-[440px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_35%,transparent)]'
						aria-hidden='true'
					>
						{currentAlbum?.imageUrl && (
							<img
								src={currentAlbum.imageUrl}
								alt=''
								className='size-full scale-125 object-cover opacity-70 blur-3xl'
							/>
						)}
						<div className='absolute inset-0 bg-black/20' />
					</div>

					<div className='relative z-10'>
						<header className='flex flex-col items-center gap-6 p-6 pt-10 sm:flex-row sm:items-end'>
							<img
								src={currentAlbum?.imageUrl}
								alt={`${currentAlbum?.title} cover`}
								className='size-48 shrink-0 rounded-md object-cover shadow-[0_8px_40px_rgba(0,0,0,0.6)] sm:size-56 lg:size-60'
							/>
							<div className='flex min-w-0 flex-col items-center text-center sm:items-start sm:text-left'>
								<p className='text-xs font-semibold uppercase tracking-widest text-white/80'>Album</p>
								<h1 className='my-3 break-words text-4xl font-extrabold leading-none tracking-tight sm:text-5xl lg:text-7xl'>
									{currentAlbum?.title}
								</h1>
								<div className='flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-sm text-white/80 sm:justify-start'>
									<span className='font-semibold text-white'>{currentAlbum?.artist}</span>
									<span aria-hidden='true'>•</span>
									<span>{currentAlbum?.releaseYear}</span>
									<span aria-hidden='true'>•</span>
									<span>
										{songs.length} {songs.length === 1 ? "song" : "songs"}, {formatTotalDuration(totalDuration)}
									</span>
								</div>
							</div>
						</header>

						{/* play button */}
						<div className='flex items-center px-6 pb-6'>
							<Button
								onClick={handlePlayAlbum}
								size='icon'
								aria-label={isPlaying && isAlbumCurrent ? "Pause album" : "Play album"}
								className='size-14 rounded-full bg-green-500 shadow-lg shadow-black/40 transition-transform
								hover:scale-105 hover:bg-green-400 active:scale-95 focus-visible:ring-2 focus-visible:ring-white [&_svg]:size-6'
							>
								{isPlaying && isAlbumCurrent ? (
									<Pause className='fill-black text-black' />
								) : (
									<Play className='ml-0.5 fill-black text-black' />
								)}
							</Button>
						</div>

						{/* track list */}
						<section aria-label='Tracks' className='px-2 pb-10 sm:px-6'>
							<div className='grid grid-cols-[2rem_1fr_auto] gap-4 border-b border-white/10 px-4 py-2 text-xs uppercase tracking-wider text-zinc-400'>
								<span className='text-right'>#</span>
								<span>Title</span>
								<span className='flex justify-end'>
									<Clock className='size-4' aria-hidden='true' />
									<span className='sr-only'>Duration</span>
								</span>
							</div>

							<ol className='mt-2'>
								{songs.map((song, index) => {
									const isCurrentSong = currentSong?._id === song._id;
									return (
										<li key={song._id}>
											<button
												type='button'
												onClick={() => handlePlaySong(index)}
												className='group grid w-full grid-cols-[2rem_1fr_auto] items-center gap-4 rounded-md px-4 py-2 text-left
												text-sm text-zinc-400 transition-colors hover:bg-white/10 focus-visible:bg-white/10
												focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500'
											>
												<span className='flex justify-end'>
													{isCurrentSong && isPlaying ? (
														<Equalizer />
													) : (
														<>
															<span
																className={`tabular-nums group-hover:hidden group-focus-visible:hidden ${
																	isCurrentSong ? "text-green-500" : ""
																}`}
															>
																{index + 1}
															</span>
															<Play className='hidden size-4 fill-white text-white group-hover:block group-focus-visible:block' />
														</>
													)}
												</span>

												<span className='flex min-w-0 items-center gap-3'>
													<img src={song.imageUrl} alt='' className='size-10 shrink-0 rounded' />
													<span className='min-w-0'>
														<span
															className={`block truncate font-medium ${
																isCurrentSong ? "text-green-500" : "text-white"
															}`}
														>
															{song.title}
														</span>
														<span className='block truncate'>{song.artist}</span>
													</span>
												</span>

												<span className='tabular-nums'>{formatDuration(song.duration)}</span>
											</button>
										</li>
									);
								})}
							</ol>
						</section>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
}
