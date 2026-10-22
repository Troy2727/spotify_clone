import { Laptop2, ListMusic, type LucideIcon, Mic2, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import Waveform from "./Waveform";

/** 125 -> "2:05" */
const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

const audioElement = () => document.querySelector("audio");

/** Playback position and length of the shared <audio> element (see AudioPlayer). */
function useProgress(songKey: unknown) {
	const [time, setTime] = useState(0);
	const [length, setLength] = useState(0);
	useEffect(() => {
		const audio = audioElement();
		if (!audio) return;
		const onTime = () => setTime(audio.currentTime);
		const onMeta = () => setLength(audio.duration);
		audio.addEventListener("timeupdate", onTime);
		audio.addEventListener("loadedmetadata", onMeta);
		return () => {
			audio.removeEventListener("timeupdate", onTime);
			audio.removeEventListener("loadedmetadata", onMeta);
		};
	}, [songKey]);
	return { time, length };
}

const seek = ([seconds]: number[]) => {
	const audio = audioElement();
	if (audio) audio.currentTime = seconds;
};

function IconButton({ icon: Icon, label, className = "", ...props }: { icon: LucideIcon; label: string } & React.ComponentProps<typeof Button>) {
	return (
		<Button size='icon' variant='ghost' aria-label={label} title={label} className={`text-zinc-400 hover:text-white ${className}`} {...props}>
			<Icon className='h-4 w-4' />
		</Button>
	);
}

/** The bottom bar: now playing, transport controls with a seek bar, and volume. */
export function PlaybackControls() {
	const { currentSong, isPlaying, togglePlay, playNext, playPrevious } = usePlayerStore();
	const { time, length } = useProgress(currentSong);
	const [volume, setVolume] = useState(75);
	const nothingLoaded = !currentSong;

	const changeVolume = ([value]: number[]) => {
		setVolume(value);
		const audio = audioElement();
		if (audio) audio.volume = value / 100;
	};

	const seekBar = (className: string) => (
		<Slider value={[time]} max={length || 100} step={1} className={className} onValueChange={seek} aria-label='Seek' />
	);

	return (
		<footer className='border-t border-white/[0.06] bg-black/45 px-4 py-2 sm:h-24 sm:py-0'>
			<div className='mx-auto flex h-full max-w-[1800px] flex-wrap content-center items-center justify-between gap-x-2 gap-y-1 sm:flex-nowrap sm:gap-0'>
				{/* Now playing */}
				<div className='flex min-w-0 flex-1 items-center gap-3 sm:w-[30%] sm:min-w-[180px] sm:flex-none sm:gap-4'>
					{currentSong && (
						<>
							<img src={currentSong.imageUrl} alt={currentSong.title} className='h-10 w-10 rounded-md object-cover sm:h-14 sm:w-14' />
							<div className='min-w-0 flex-1'>
								<p className='truncate font-medium'>{currentSong.title}</p>
								<p className='truncate text-sm text-zinc-400'>{currentSong.artist}</p>
							</div>
							<div className='hidden md:block'>
								<Waveform />
							</div>
						</>
					)}
				</div>

				{/* Transport. On phones, pl-16 (waveform 56px + 8px gap) centers the buttons under the progress bar. */}
				<div
					className={`order-last flex w-full max-w-full flex-col items-center gap-2 sm:order-none sm:w-auto sm:max-w-[45%] sm:flex-1 sm:pl-0 ${currentSong ? "pl-16" : ""}`}
				>
					<div className='flex items-center gap-1 sm:gap-6'>
						<IconButton icon={Shuffle} label='Shuffle' className='hidden sm:inline-flex' />
						<IconButton icon={SkipBack} label='Previous' onClick={playPrevious} disabled={nothingLoaded} />
						<Button
							size='icon'
							aria-label={isPlaying ? "Pause" : "Play"}
							className='h-8 w-8 rounded-full bg-white text-black hover:bg-white/80'
							onClick={togglePlay}
							disabled={nothingLoaded}
						>
							{isPlaying ? <Pause className='h-5 w-5' /> : <Play className='h-5 w-5' />}
						</Button>
						<IconButton icon={SkipForward} label='Next' onClick={playNext} disabled={nothingLoaded} />
						<IconButton icon={Repeat} label='Repeat' className='hidden sm:inline-flex' />
					</div>
					<div className='hidden w-full items-center gap-2 sm:flex'>
						<span className='text-xs text-zinc-400'>{clock(time)}</span>
						{seekBar("w-full hover:cursor-grab active:cursor-grabbing")}
						<span className='text-xs text-zinc-400'>{clock(length)}</span>
					</div>
				</div>

				{/* Extras and volume */}
				<div className='hidden w-[30%] min-w-[180px] items-center justify-end gap-4 sm:flex'>
					<IconButton icon={Mic2} label='Lyrics' />
					<IconButton icon={ListMusic} label='Queue' />
					<IconButton icon={Laptop2} label='Devices' />
					<div className='flex items-center gap-2'>
						<IconButton icon={Volume1} label='Volume' />
						<Slider
							value={[volume]}
							max={100}
							step={1}
							className='w-24 hover:cursor-grab active:cursor-grabbing'
							onValueChange={changeVolume}
							aria-label='Volume'
						/>
					</div>
				</div>

				{/* Phones: waveform and progress get their own row */}
				<div className='flex h-6 w-full items-center gap-2 sm:hidden'>
					{currentSong && <Waveform />}
					{seekBar("w-full")}
				</div>
			</div>
		</footer>
	);
}
