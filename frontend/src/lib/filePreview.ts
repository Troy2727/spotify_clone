// Object URL for previewing a file the user picked, or null if it isn't the expected kind of media.
// (The picker's `accept` attribute is only a hint, so the type is checked here.)
export const previewUrl = (file: File, kind: "image" | "audio"): string | null => {
	if (!file.type.startsWith(`${kind}/`)) return null;
	const url = URL.createObjectURL(file);
	return url.startsWith("blob:") ? url : null;
};
