import { getAnalyser } from "@/lib/audioAnalyser";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const BARS = 14;
const WIDTH = 56;
const HEIGHT = 24;
const BAR_GAP = 2;
const MIN_BAR = 2;

// Live, audio-reactive bars for the now-playing song. Bars ease back down when paused,
// and stay still (no animation loop) for people who prefer reduced motion.
const Waveform = () => {
	const isPlaying = usePlayerStore((state) => state.isPlaying);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const levelsRef = useRef<number[]>(Array(BARS).fill(0));

	useEffect(() => {
		const canvas = canvasRef.current;
		const audio = document.querySelector("audio");
		const ctx = canvas?.getContext("2d");
		if (!canvas || !audio || !ctx) return;

		const dpr = window.devicePixelRatio || 1;
		canvas.width = WIDTH * dpr;
		canvas.height = HEIGHT * dpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		const gradient = ctx.createLinearGradient(0, HEIGHT, 0, 0);
		gradient.addColorStop(0, "#1db954");
		gradient.addColorStop(1, "#6ee7b7");

		const barWidth = (WIDTH - BAR_GAP * (BARS - 1)) / BARS;
		const draw = (levels: number[]) => {
			ctx.clearRect(0, 0, WIDTH, HEIGHT);
			ctx.fillStyle = gradient;
			levels.forEach((level, i) => {
				if (level < 0.01) return; // silence draws nothing rather than a row of dots
				const h = Math.max(MIN_BAR, level * HEIGHT);
				ctx.beginPath();
				ctx.roundRect(i * (barWidth + BAR_GAP), HEIGHT - h, barWidth, h, barWidth / 2);
				ctx.fill();
			});
		};

		const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (reducedMotion) {
			draw(levelsRef.current.map((_, i) => (isPlaying ? 0.35 + 0.25 * Math.sin(i * 1.3) ** 2 : 0)));
			return;
		}

		let frame = 0;
		let cancelled = false;
		let data: Uint8Array | null = null;
		let analyser: AnalyserNode | null = null;

		const tick = () => {
			const levels = levelsRef.current;
			if (isPlaying && analyser && data) {
				analyser.getByteFrequencyData(data);
				// skip the top bins, which are mostly empty for music
				for (let i = 0; i < BARS; i++) levels[i] = data[i + 1] / 255;
			} else {
				for (let i = 0; i < BARS; i++) levels[i] *= 0.85;
			}
			draw(levels);
			const settled = !isPlaying && levels.every((level) => level < 0.01);
			if (!settled) frame = requestAnimationFrame(tick);
		};

		if (isPlaying) {
			getAnalyser(audio).then((node) => {
				if (cancelled) return;
				analyser = node;
				data = node ? new Uint8Array(node.frequencyBinCount) : null;
				frame = requestAnimationFrame(tick);
			});
		} else {
			frame = requestAnimationFrame(tick);
		}

		return () => {
			cancelled = true;
			cancelAnimationFrame(frame);
		};
	}, [isPlaying]);

	return <canvas ref={canvasRef} aria-hidden='true' style={{ width: WIDTH, height: HEIGHT }} className='shrink-0' />;
};

export default Waveform;
