import { formatDuration } from "@/pages/album/AlbumPage";
import { useMusicStore } from "@/stores/useMusicStore";
import CoverPlayButton from "./CoverPlayButton";
import DashboardStats from "./DashboardStats";

const Panel = ({ title, description, action, children }: { title: string; description: string; action?: React.ReactNode; children: React.ReactNode }) => (
	<section className='rounded-xl border border-white/[0.06] bg-white/[0.03] p-5'>
		<div className='mb-4 flex items-start justify-between gap-4'>
			<div>
				<h2 className='font-semibold'>{title}</h2>
				<p className='text-sm text-zinc-400'>{description}</p>
			</div>
			{action}
		</div>
		{children}
	</section>
);

const Overview = ({ onNavigate }: { onNavigate: (section: string) => void }) => {
	const { songs, albums } = useMusicStore();

	const counts = new Map<string, number>();
	songs.forEach((song) => counts.set(song.artist, (counts.get(song.artist) ?? 0) + 1));
	const topArtists = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 6);
	const max = topArtists[0]?.[1] ?? 1;

	const recent = [...songs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
	const albumTitle = (albumId: string | null) => albums.find((album) => album._id === albumId)?.title ?? "Single";

	return (
		<div className='space-y-6'>
			<DashboardStats />

			<div className='grid gap-6 lg:grid-cols-2'>
				<Panel title='Top artists' description='By number of songs in the catalog'>
					{topArtists.length === 0 ? (
						<p className='py-6 text-center text-sm text-zinc-400'>No songs yet</p>
					) : (
						<ol className='space-y-3'>
							{topArtists.map(([artist, count]) => (
								<li key={artist}>
									<div className='mb-1.5 flex justify-between gap-4 text-sm'>
										<span className='truncate font-medium'>{artist}</span>
										<span className='shrink-0 tabular-nums text-zinc-400'>
											{count} {count === 1 ? "song" : "songs"}
										</span>
									</div>
									<div className='h-2 rounded-full bg-white/5' aria-hidden='true'>
										<div
											className='h-full rounded-full bg-gradient-to-r from-green-600 to-emerald-300'
											style={{ width: `${(count / max) * 100}%` }}
										/>
									</div>
								</li>
							))}
						</ol>
					)}
				</Panel>

				<Panel
					title='Recently added'
					description='Latest songs in the catalog'
					action={
						<button
							type='button'
							onClick={() => onNavigate("songs")}
							className='shrink-0 rounded text-sm font-medium text-zinc-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500'
						>
							View all
						</button>
					}
				>
					{recent.length === 0 ? (
						<p className='py-6 text-center text-sm text-zinc-400'>No songs yet</p>
					) : (
						<ul className='space-y-1'>
							{recent.map((song) => (
								<li key={song._id} className='flex items-center gap-3 rounded-lg p-2 hover:bg-white/5'>
									<CoverPlayButton song={song} className='size-10' />
									<div className='min-w-0 flex-1'>
										<p className='truncate text-sm font-medium'>{song.title}</p>
										<p className='truncate text-xs text-zinc-400'>
											{song.artist} · {albumTitle(song.albumId)}
										</p>
									</div>
									<span className='text-xs tabular-nums text-zinc-400'>{formatDuration(song.duration)}</span>
								</li>
							))}
						</ul>
					)}
				</Panel>
			</div>
		</div>
	);
};

export default Overview;
