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
import { axiosInstance } from "@/lib/axios";
import { isDemoMode } from "@/lib/demoMode";
import { useMusicStore } from "@/stores/useMusicStore";
import { ImagePlus, Plus } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const currentYear = new Date().getFullYear();
const EMPTY_ALBUM = { title: "", artist: "", releaseYear: currentYear };
const fieldClass = "border-white/10 bg-white/5 focus-visible:ring-green-500";

const AddAlbumDialog = () => {
	const { addDemoAlbum, fetchAlbums } = useMusicStore();
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [newAlbum, setNewAlbum] = useState(EMPTY_ALBUM);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [preview, setPreview] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const selectImage = (file: File | undefined) => {
		if (!file) return;
		if (preview) URL.revokeObjectURL(preview);
		setImageFile(file);
		setPreview(URL.createObjectURL(file));
	};

	// keepPreview: the demo album's cover is this object URL, so it must stay alive
	const reset = (keepPreview = false) => {
		if (!keepPreview && preview) URL.revokeObjectURL(preview);
		setNewAlbum(EMPTY_ALBUM);
		setImageFile(null);
		setPreview("");
	};

	const validYear = Number.isInteger(newAlbum.releaseYear) && newAlbum.releaseYear >= 1900 && newAlbum.releaseYear <= currentYear;
	const canSubmit = Boolean(newAlbum.title.trim() && newAlbum.artist.trim() && imageFile && validYear) && !isLoading;

	const handleSubmit = async () => {
		if (!canSubmit) return;
		setIsLoading(true);
		try {
			if (isDemoMode()) {
				addDemoAlbum({
					_id: `demo_album_${Date.now()}`,
					title: newAlbum.title.trim(),
					artist: newAlbum.artist.trim(),
					imageUrl: preview,
					releaseYear: newAlbum.releaseYear,
					songs: [],
				});
				toast.success("Album added (demo, resets on reload)");
				reset(true);
			} else {
				const formData = new FormData();
				formData.append("title", newAlbum.title.trim());
				formData.append("artist", newAlbum.artist.trim());
				formData.append("releaseYear", newAlbum.releaseYear.toString());
				formData.append("imageFile", imageFile!);

				await axiosInstance.post("/admin/albums", formData, {
					headers: { "Content-Type": "multipart/form-data" },
				});
				toast.success("Album created successfully");
				reset();
				fetchAlbums();
			}
			setOpen(false);
		} catch (error: any) {
			toast.error("Failed to create album: " + error.message);
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
					Add album
				</Button>
			</DialogTrigger>
			<DialogContent className='border-white/10 bg-zinc-900 sm:max-w-xl'>
				<DialogHeader>
					<DialogTitle>Add an album</DialogTitle>
					<DialogDescription>Upload the cover art and fill in the release details.</DialogDescription>
				</DialogHeader>

				<input type='file' ref={fileInputRef} onChange={(e) => selectImage(e.target.files?.[0])} accept='image/*' hidden />

				<div className='grid gap-5 py-2 sm:grid-cols-[160px_1fr]'>
					<button
						type='button'
						onClick={() => fileInputRef.current?.click()}
						className='group relative flex aspect-square w-40 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-white/15 bg-white/[0.03] transition-colors hover:border-green-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500'
					>
						{preview ? (
							<>
								<img src={preview} alt='Selected cover art' className='size-full object-cover' />
								<span className='absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-xs opacity-0 transition-opacity group-hover:opacity-100'>
									Change cover
								</span>
							</>
						) : (
							<span className='flex flex-col items-center gap-2 text-sm text-zinc-400'>
								<ImagePlus className='size-6' aria-hidden='true' />
								Add cover art
							</span>
						)}
					</button>

					<div className='space-y-4'>
						<div className='space-y-1.5'>
							<label htmlFor='album-title' className='text-sm font-medium'>
								Album title
							</label>
							<Input
								id='album-title'
								value={newAlbum.title}
								onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
								placeholder='Album title'
								className={fieldClass}
							/>
						</div>
						<div className='space-y-1.5'>
							<label htmlFor='album-artist' className='text-sm font-medium'>
								Artist
							</label>
							<Input
								id='album-artist'
								value={newAlbum.artist}
								onChange={(e) => setNewAlbum({ ...newAlbum, artist: e.target.value })}
								placeholder='Artist name'
								className={fieldClass}
							/>
						</div>
						<div className='space-y-1.5'>
							<label htmlFor='album-year' className='text-sm font-medium'>
								Release year
							</label>
							<Input
								id='album-year'
								type='number'
								value={newAlbum.releaseYear}
								onChange={(e) => setNewAlbum({ ...newAlbum, releaseYear: parseInt(e.target.value) })}
								min={1900}
								max={currentYear}
								aria-invalid={!validYear}
								className={fieldClass}
							/>
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
						{isLoading ? "Creating…" : "Add album"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
export default AddAlbumDialog;
