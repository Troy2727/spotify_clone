import mongoose from "mongoose";

/** Connect to MONGODB_URI, or stop the server: nothing works without the database. */
export async function connectDB() {
	try {
		const { connection } = await mongoose.connect(process.env.MONGODB_URI);
		console.log(`MongoDB connected (${connection.host})`);
	} catch (error) {
		console.error("Could not connect to MongoDB:", error.message);
		process.exit(1);
	}
}
