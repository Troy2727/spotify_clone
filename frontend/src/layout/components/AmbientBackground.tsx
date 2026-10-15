import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useState } from "react";

// Full-window backdrop tinted by the current song's cover. The newest cover fades in over
// the previous one, so the app's color shifts smoothly when the song changes.
const AmbientBackground = () => {
	const imageUrl = usePlayerStore((state) => state.currentSong?.imageUrl);
	const [layers, setLayers] = useState<string[]>([]);

	useEffect(() => {
		if (!imageUrl) return;
		setLayers((prev) => (prev[prev.length - 1] === imageUrl ? prev : [...prev.slice(-1), imageUrl]));
	}, [imageUrl]);

	return (
		<div aria-hidden='true' className='pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#121212]'>
			{layers.map((url) => (
				<img
					key={url}
					src={url}
					alt=''
					className='ambient-layer absolute inset-0 size-full scale-125 object-cover opacity-60 blur-[90px] saturate-150 brightness-50'
				/>
			))}
			{/* dark enough that small grey text keeps WCAG contrast even over pale covers */}
			<div className='absolute inset-0 bg-gradient-to-b from-black/45 via-black/60 to-black/80' />
		</div>
	);
};

export default AmbientBackground;
