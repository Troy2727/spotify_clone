/** 185 -> "3:05" */
export function formatDuration(seconds: number): string {
	const whole = Math.floor(seconds);
	return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
}

/** 185 -> "3 min 5 sec", 40 -> "40 sec" (album header). */
export function formatLength(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const rest = Math.floor(seconds % 60);
	return minutes ? `${minutes} min ${rest} sec` : `${rest} sec`;
}
