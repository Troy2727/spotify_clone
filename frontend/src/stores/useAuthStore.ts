import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

// Check if we're in Vercel production environment
const isVercelProduction = () => {
	return !import.meta.env.DEV && window.location.hostname.includes('vercel.app');
};

interface AuthStore {
	isAdmin: boolean;
	isLoading: boolean;
	error: string | null;

	checkAdminStatus: () => Promise<void>;
	reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	isAdmin: false,
	isLoading: false,
	error: null,

	checkAdminStatus: async () => {
		set({ isLoading: true, error: null });
		console.log("Checking admin status...");

		// For Vercel demo environment, set admin to true
		if (isVercelProduction()) {
			console.log("In Vercel production environment, setting admin to true for demo purposes");
			set({ isAdmin: true });
			set({ isLoading: false });
			return;
		}

		try {
			const response = await axiosInstance.get("/admin/check");
			console.log("Admin check response:", response.data);
			set({ isAdmin: response.data.admin });
			console.log("Admin status set to:", response.data.admin);
		} catch (error: any) {
			console.error("Admin check error:", error);
			console.error("Error response:", error.response?.data || "No response data");
			set({ isAdmin: false, error: error.response?.data?.message || "Error checking admin status" });
		} finally {
			set({ isLoading: false });
		}
	},

	reset: () => {
		set({ isAdmin: false, isLoading: false, error: null });
	},
}));
