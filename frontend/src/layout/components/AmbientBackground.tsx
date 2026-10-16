import { getCoverColor } from "@/lib/coverColor";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect } from "react";

// Full-window glow in the current song's dominant color. The color lives in the --ambient
// CSS property (registered in index.css), so it animates smoothly when the song changes and
// anything else can use it, like the home page's top band.
const AmbientBackground = () => {
	const imageUrl = usePlayerStore((state) => state.currentSong?.imageUrl);

	useEffect(() => {
		if (!imageUrl) return;
		let cancelled = false;
		getCoverColor(imageUrl).then((color) => {
			if (!cancelled && color) document.documentElement.style.setProperty("--ambient", color);
		});
		return () => {
			cancelled = true;
		};
	}, [imageUrl]);

	return (
		<div aria-hidden='true' className='pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#121212]'>
			<div className='ambient-glow absolute -inset-[15%]' />
		</div>
	);
};

export default AmbientBackground;
