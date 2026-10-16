import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AmbientBackground from "@/layout/components/AmbientBackground";
import AudioPlayer from "@/layout/components/AudioPlayer";
import { PlaybackControls } from "@/layout/components/PlaybackControls";
import { userButtonAppearance } from "@/lib/clerkAppearance";
import { isDemoMode } from "@/lib/demoMode";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { UserButton } from "@clerk/clerk-react";
import { ArrowLeft, Disc3, FlaskConical, LayoutDashboard, Music, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AlbumsTabContent from "./components/AlbumsTabContent";
import Overview from "./components/Overview";
import SongsTabContent from "./components/SongsTabContent";

const SECTIONS = [
	{ value: "overview", label: "Overview", description: "Your catalog at a glance", icon: LayoutDashboard },
	{ value: "songs", label: "Songs", description: "Search, play and manage tracks", icon: Music },
	{ value: "albums", label: "Albums", description: "Browse and manage releases", icon: Disc3 },
];

const AdminPage = () => {
	const { isAdmin, isLoading } = useAuthStore();
	const { fetchAlbums, fetchSongs, fetchStats, songs, albums } = useMusicStore();
	const [section, setSection] = useState("overview");

	useEffect(() => {
		fetchAlbums();
		fetchSongs();
		fetchStats();
	}, [fetchAlbums, fetchSongs, fetchStats]);

	if (!isAdmin && !isLoading) {
		return (
			<div className='flex h-screen flex-col items-center justify-center gap-4 bg-[#121212] p-6 text-center text-zinc-100'>
				<ShieldAlert className='size-10 text-zinc-500' aria-hidden='true' />
				<h1 className='text-2xl font-bold'>Admins only</h1>
				<p className='max-w-sm text-zinc-400'>You need an admin account to manage the music catalog.</p>
				<Link to='/' className='rounded-full bg-green-500 px-5 py-2 font-semibold text-black hover:bg-green-400'>
					Back to the app
				</Link>
			</div>
		);
	}

	const counts: Record<string, number> = { songs: songs.length, albums: albums.length };
	const current = SECTIONS.find((s) => s.value === section) ?? SECTIONS[0];

	return (
		<div className='relative isolate flex h-screen flex-col bg-black text-zinc-100'>
			<AmbientBackground />
			<AudioPlayer />

			<Tabs
				value={section}
				onValueChange={setSection}
				orientation='vertical'
				className='flex min-h-0 flex-1 flex-col gap-2 p-2 md:flex-row'
			>
				{/* sidebar (a top bar on small screens) */}
				<aside className='glass-panel flex shrink-0 flex-col gap-4 rounded-lg p-3 md:w-60 md:p-4'>
					<Link
						to='/'
						className='flex items-center gap-3 rounded-md px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500'
					>
						<img src='/spotify.png' alt='' className='size-8' />
						<div>
							<p className='font-bold leading-tight'>Music Manager</p>
							<p className='text-xs text-zinc-400'>Admin dashboard</p>
						</div>
					</Link>

					<TabsList className='flex h-auto justify-start gap-1 overflow-x-auto bg-transparent p-0 md:flex-col md:items-stretch'>
						{SECTIONS.map(({ value, label, icon: Icon }) => (
							<TabsTrigger
								key={value}
								value={value}
								className='justify-start gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-white/5 hover:text-white
								data-[state=active]:bg-white/10 data-[state=active]:text-white data-[state=active]:shadow-none'
							>
								<Icon className='size-4' aria-hidden='true' />
								{label}
								{value in counts && (
									<span className='ml-auto rounded-full bg-white/10 px-2 py-0.5 text-xs tabular-nums text-zinc-300'>
										{counts[value]}
									</span>
								)}
							</TabsTrigger>
						))}
					</TabsList>

					<Link
						to='/'
						className='mt-auto hidden items-center gap-2 rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 md:flex'
					>
						<ArrowLeft className='size-4' aria-hidden='true' />
						Back to the app
					</Link>
				</aside>

				<main className='glass-panel min-h-0 flex-1 overflow-y-auto rounded-lg'>
					<header className='sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/[0.06] bg-zinc-950/60 px-4 py-4 backdrop-blur-md sm:px-6'>
						<div className='min-w-0'>
							<h1 className='truncate text-xl font-bold sm:text-2xl'>{current.label}</h1>
							<p className='truncate text-sm text-zinc-400'>{current.description}</p>
						</div>
						<div className='flex shrink-0 items-center gap-3'>
							{isDemoMode() && (
								<span
									className='inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-200'
									title='The live demo has no database: changes last until you reload'
								>
									<FlaskConical className='size-3.5' aria-hidden='true' />
									Demo mode<span className='hidden sm:inline'> · changes reset on reload</span>
								</span>
							)}
							<UserButton appearance={userButtonAppearance} />
						</div>
					</header>

					<div className='p-4 sm:p-6'>
						<TabsContent value='overview' className='mt-0'>
							<Overview onNavigate={setSection} />
						</TabsContent>
						<TabsContent value='songs' className='mt-0'>
							<SongsTabContent />
						</TabsContent>
						<TabsContent value='albums' className='mt-0'>
							<AlbumsTabContent />
						</TabsContent>
					</div>
				</main>
			</Tabs>

			<PlaybackControls />
		</div>
	);
};
export default AdminPage;
