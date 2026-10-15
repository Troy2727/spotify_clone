// Shared Web Audio analyser for the player's <audio> element (drives the waveform).
//
// Once an element is routed through Web Audio, its sound only reaches the speakers via the
// AudioContext, so a suspended context would mean silence. We therefore only connect the
// element after the context reports "running"; if it never does, playback stays untouched.

let context: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let connecting: Promise<AnalyserNode | null> | null = null;
const connected = new WeakSet<HTMLMediaElement>();

export const getAnalyser = async (audio: HTMLMediaElement): Promise<AnalyserNode | null> => {
	if (analyser && connected.has(audio)) return analyser;
	if (connecting) return connecting;

	connecting = (async () => {
		try {
			context ??= new AudioContext();
			if (context.state !== "running") await context.resume();
			if (context.state !== "running") return null;

			if (!analyser) {
				analyser = context.createAnalyser();
				analyser.fftSize = 64;
				analyser.smoothingTimeConstant = 0.8;
				analyser.connect(context.destination);
			}
			if (!connected.has(audio)) {
				context.createMediaElementSource(audio).connect(analyser);
				connected.add(audio);
			}
			return analyser;
		} catch (error) {
			console.warn("Waveform unavailable:", error);
			return null;
		} finally {
			connecting = null;
		}
	})();

	return connecting;
};
