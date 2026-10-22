// Which browser origins may call the API and open a chat socket.
// Development allows any origin; production allows only the known front ends.

const KNOWN_ORIGINS = [
	"http://localhost:3000",
	"http://localhost:3001",
	"http://localhost:5173", // Vite's default dev port
	process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
	process.env.FRONTEND_URL,
].filter(Boolean);

const isProduction = () => process.env.NODE_ENV === "production";

/** `origin` option shared by the cors middleware and Socket.IO. */
export function allowedOrigin() {
	if (!isProduction()) return true;
	return (origin, callback) => {
		// Requests without an Origin header (curl, server-to-server) aren't browser CORS requests.
		if (!origin || KNOWN_ORIGINS.includes(origin)) return callback(null, true);
		callback(new Error(`Origin ${origin} is not allowed`));
	};
}
