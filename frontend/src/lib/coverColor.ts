// Picks a cover's dominant color for the ambient background, then darkens it until it's
// dark enough that grey text on the translucent panels above it keeps WCAG AA contrast.

type RGB = [number, number, number];

// Relative luminance cap for the ambient color (tuned against all covers so zinc-400 text stays >= 4.5:1)
export const MAX_AMBIENT_LUMINANCE = 0.1;

const cache = new Map<string, string | null>();

const toLinear = (v: number) => {
	const c = v / 255;
	return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]: RGB) => 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

const rgbToHsl = ([r, g, b]: RGB): RGB => {
	const [rn, gn, bn] = [r / 255, g / 255, b / 255];
	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	const l = (max + min) / 2;
	if (max === min) return [0, 0, l];
	const d = max - min;
	const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	const h = max === rn ? (gn - bn) / d + (gn < bn ? 6 : 0) : max === gn ? (bn - rn) / d + 2 : (rn - gn) / d + 4;
	return [h / 6, s, l];
};

const hslToRgb = ([h, s, l]: RGB): RGB => {
	if (s === 0) return [l * 255, l * 255, l * 255];
	const hue = (p: number, q: number, t: number) => {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};
	const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	const p = 2 * l - q;
	return [hue(p, q, h + 1 / 3) * 255, hue(p, q, h) * 255, hue(p, q, h - 1 / 3) * 255];
};

const HUE_BUCKETS = 12;

// The cover's strongest hue: pixels are grouped by hue (weighted toward vivid ones so black/white
// areas don't wash it out) and the heaviest group is averaged. Averaging every pixel instead would
// turn multicolored covers grey, since red + green + blue mix to grey.
const dominantColor = (data: Uint8ClampedArray): RGB => {
	const buckets = Array.from({ length: HUE_BUCKETS + 1 }, () => ({ r: 0, g: 0, b: 0, weight: 0 }));
	for (let i = 0; i < data.length; i += 4) {
		const px: RGB = [data[i], data[i + 1], data[i + 2]];
		const chroma = (Math.max(...px) - Math.min(...px)) / 255;
		const weight = chroma * chroma + 0.01;
		// near-grey pixels share their own bucket, so a black-and-white cover still gets a (neutral) color
		const index = chroma < 0.1 ? HUE_BUCKETS : Math.floor(rgbToHsl(px)[0] * HUE_BUCKETS) % HUE_BUCKETS;
		const bucket = buckets[index];
		bucket.r += px[0] * weight;
		bucket.g += px[1] * weight;
		bucket.b += px[2] * weight;
		bucket.weight += weight;
	}
	const top = buckets.reduce((best, bucket) => (bucket.weight > best.weight ? bucket : best));
	return [top.r / top.weight, top.g / top.weight, top.b / top.weight];
};

export const ambientFromRgb = (rgb: RGB): RGB => {
	const [h, s] = rgbToHsl(rgb);
	const saturation = Math.min(1, s * 1.25);
	let l = 0.5;
	let color = hslToRgb([h, saturation, l]);
	while (luminance(color) > MAX_AMBIENT_LUMINANCE && l > 0.05) {
		l -= 0.01;
		color = hslToRgb([h, saturation, l]);
	}
	return color.map(Math.round) as RGB;
};

// "rgb(r g b)" for the cover at `url`, or null if it can't be read
export const getCoverColor = async (url: string): Promise<string | null> => {
	if (cache.has(url)) return cache.get(url)!;
	let result: string | null = null;
	try {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.src = url;
		await img.decode();
		const canvas = document.createElement("canvas");
		canvas.width = canvas.height = 24;
		const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
		ctx.drawImage(img, 0, 0, 24, 24);
		const [r, g, b] = ambientFromRgb(dominantColor(ctx.getImageData(0, 0, 24, 24).data));
		result = `rgb(${r} ${g} ${b})`;
	} catch (error) {
		console.warn("Could not read cover color:", error);
	}
	cache.set(url, result);
	return result;
};
