import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";
import { isDemoMode } from "@/lib/demoMode";
import { formatDuration } from "@/pages/album/AlbumPage";
import { useMusicStore } from "@/stores/useMusicStore";
import { ImagePlus, Music2, Plus } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const EMPTY_SONG = { title: "", artist: "", album: "none", duration: "0" };
const fieldClass = "border-white/10 bg-white/5 focus-visible:ring-green-500";

const AddSongDialog = () => {
	const { albums, addDemoSong, fetchSongs, fetchAlbums } = useMusicStore();
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [newSong, setNewSong] = useState(EMPTY_SONG);
	const [files, setFiles] = useState<{ audio: File | null; image: File | null }>({ audio: null, image: null });
	const [previews, setPreviews] = useState<{ audio: string; image: string }>({ audio: "", image: "" });

	const audioInputRef = useRef<HTMLInputElement>(null);
	const imageInputRef = useRef<HTMLInputElement>(null);

	const selectFile = (kind: "audio" | "image", file: File | undefined) => {
		if (!file) return;
		if (previews[kind]) URL.revokeObjectURL(previews[kind]);
		const url = URL.createObjectURL(file);
		setFiles((prev) => ({ ...prev, [kind]: file }));
		setPreviews((prev) => ({ ...prev, [kind]: url }));

		if (kind === "audio") {
			// read the length from the file so it doesn't have to be typed in
			const probe = new Audio();
			probe.preload = "metadata";
			probe.onloadedmetadata = () => {
				if (Number.isFinite(probe.duration)) {
					setNewSong((prev) => ({ ...prev, duration: String(Math.round(probe.duration)) }));
				}
			};
			probe.src = url;
		}
	};

	// keepPreviews: the demo catalog now plays from these object URLs, so they must stay alive
	const reset = (keepPreviews = false) => {
		if (!keepPreviews) Object.values(previews).forEach((url) => url && URL.revokeObjectURL(url));
		setNewSong(EMPTY_SONG);
		setFiles({ audio: null, image: null });
		setPreviews({ audio: "", image: "" });
	};

	const canSubmit = Boolean(newSong.title.trim() && newSong.artist.trim() && files.audio && files.image) && !isLoading;
	const albumId = newSong.album !== "none" ? newSong.album : null;

	const handleSubmit = async () => {
		if (!canSubmit) return;
		setIsLoading(true);
		try {
			if (isDemoMode()) {
				const now = new Date().toISOString();
				addDemoSong({
					_id: `demo_song_${Date.now()}`,
					title: newSong.title.trim(),
					artist: newSong.artist.trim(),
					albumId,
					imageUrl: previews.image,
					audioUrl: previews.audio,
					duration: Number(newSong.duration) || 0,
					createdAt: now,
					updatedAt: now,
				});
				toast.success("Song added (demo, resets on reload)");
				reset(true);
			} else {
				const formData = new FormData();
				formData.append("title", newSong.title.trim());
				formData.append("artist", newSong.artist.trim());
				formData.append("duration", newSong.duration);
				if (albumId) formData.append("albumId", albumId);
				formData.append("audioFile", files.audio!);
				formData.append("imageFile", files.image!);

				await axiosInstance.post("/admin/songs", formData, {
					headers: { "Content-Type": "multipart/form-data" },
				});
				toast.success("Song added successfully");
				reset();
				fetchSongs();
				fetchAlbums();
			}
			setOpen(false);
		} catch (error: any) {
			toast.error("Failed to add song: " + error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) reset();
			}}
		>
			<DialogTrigger asChild>
				<Button className='h-10 shrink-0 bg-green-500 font-semibold text-black hover:bg-green-400'>
					<Plus className='size-4' />
					Add song
				</Button>
			</DialogTrigger>

			<DialogContent className='max-h-[90vh] overflow-auto border-white/10 bg-zinc-900 sm:max-w-xl'>
				<DialogHeader>
					<DialogTitle>Add a song</DialogTitle>
					<DialogDescription>Upload the track and its artwork, then fill in the details.</DialogDescription>
				</DialogHeader>

				<input type='file' accept='audio/*' ref={audioInputRef} hidden onChange={(e) => selectFile("audio", e.target.files?.[0])} />
				<input type='file' accept='image/*' ref={imageInputRef} hidden onChange={(e) => selectFile("image", e.target.files?.[0])} />

				<div className='grid gap-5 py-2 sm:grid-cols-[160px_1fr]'>
					<button
						type='button'
						onClick={() => imageInputRef.current?.click()}
						className='group relative flex aspect-square w-40 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-white/15 bg-white/[0.03] transition-colors hover:border-green-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500'
					>
						{previews.image ? (
							<>
								<img src={previews.image} alt='Selected artwork' className='size-full object-cover' />
								<span className='absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-xs opacity-0 transition-opacity group-hover:opacity-100'>
									Change artwork
								</span>
							</>
						) : (
							<span className='flex flex-col items-center gap-2 text-sm text-zinc-400'>
								<ImagePlus className='size-6' aria-hidden='true' />
								Add artwork
							</span>
						)}
					</button>

					<div className='space-y-4'>
						<div className='space-y-1.5'>
							<span className='text-sm font-medium'>Audio file</span>
							<Button
								type='button'
								variant='outline'
								onClick={() => audioInputRef.current?.click()}
								className='w-full justify-start border-white/10 bg-white/5 font-normal hover:bg-white/10'
							>
								<Music2 className='size-4 text-green-400' aria-hidden='true' />
								<span className='truncate'>{files.audio ? files.audio.name : "Choose an audio file"}</span>
								{files.audio && Number(newSong.duration) > 0 && (
									<span className='ml-auto text-xs tabular-nums text-zinc-400'>{formatDuration(Number(newSong.duration))}</span>
								)}
							</Button>
						</div>

						<div className='space-y-1.5'>
							<label htmlFor='song-title' className='text-sm font-medium'>
								Title
							</label>
							<Input
								id='song-title'
								value={newSong.title}
								onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
								placeholder='Song title'
								className={fieldClass}
							/>
						</div>

						<div className='space-y-1.5'>
							<label htmlFor='song-artist' className='text-sm font-medium'>
								Artist
							</label>
							<Input
								id='song-artist'
								value={newSong.artist}
								onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
								placeholder='Artist name'
								className={fieldClass}
							/>
						</div>

						<div className='grid grid-cols-2 gap-3'>
							<div className='space-y-1.5'>
								<label htmlFor='song-duration' className='text-sm font-medium'>
									Duration (sec)
								</label>
								<Input
									id='song-duration'
									type='number'
									min='0'
									value={newSong.duration}
									onChange={(e) => setNewSong({ ...newSong, duration: e.target.value || "0" })}
									className={fieldClass}
								/>
							</div>
							<div className='space-y-1.5'>
								<span className='text-sm font-medium'>Album</span>
								<Select value={newSong.album} onValueChange={(value) => setNewSong({ ...newSong, album: value })}>
									<SelectTrigger aria-label='Album' className={fieldClass}>
										<SelectValue placeholder='Select album' />
									</SelectTrigger>
									<SelectContent className='border-white/10 bg-zinc-900'>
										<SelectItem value='none'>Single (no album)</SelectItem>
										{albums.map((album) => (
											<SelectItem key={album._id} value={album._id}>
												{album.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					</div>
				</div>

				<DialogFooter className='gap-2'>
					<Button
						variant='ghost'
						onClick={() => {
							setOpen(false);
							reset();
						}}
						disabled={isLoading}
					>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={!canSubmit} className='bg-green-500 font-semibold text-black hover:bg-green-400'>
						{isLoading ? "Uploading…" : "Add song"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
export default AddSongDialog;
