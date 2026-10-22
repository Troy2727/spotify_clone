import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";

interface AuthStore {
	isAdmin: boolean;
	isLoading: boolean;
	error: string | null;
	checkAdminStatus: () => Promise<void>;
	reset: () => void;
}

/** Whether the signed-in user may open the admin dashboard (the server decides). */
export const useAuthStore = create<AuthStore>((set) => ({
	isAdmin: false,
	isLoading: false,
	error: null,

	checkAdminStatus: async () => {
		set({ isLoading: true, error: null });
		try {
			const { data } = await axiosInstance.get<{ admin: boolean }>("/admin/check");
			set({ isAdmin: data.admin });
		} catch (error) {
			const reason = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
			set({ isAdmin: false, error: reason ?? "Error checking admin status" });
		} finally {
			set({ isLoading: false });
		}
	},

	reset: () => set({ isAdmin: false, isLoading: false, error: null }),
}));
