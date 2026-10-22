import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";

/** Attach (or remove) the Clerk session token on every API request. */
function setApiToken(token: string | null) {
	if (token) axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
	else delete axiosInstance.defaults.headers.common.Authorization;
}

/**
 * Before rendering the app: send the Clerk token with API calls, check whether
 * the user is an admin, and connect to chat. Disconnects chat on sign-out.
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
	const { getToken, userId } = useAuth();
	const checkAdminStatus = useAuthStore((s) => s.checkAdminStatus);
	const initSocket = useChatStore((s) => s.initSocket);
	const disconnectSocket = useChatStore((s) => s.disconnectSocket);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				const token = await getToken();
				setApiToken(token);
				if (token) {
					await checkAdminStatus();
					if (userId) initSocket(userId);
				}
			} catch (error) {
				setApiToken(null);
				console.error("Setting up the session failed:", error);
			} finally {
				setReady(true);
			}
		})();
		return () => disconnectSocket();
	}, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket]);

	if (!ready) {
		return (
			<div className="flex h-screen w-full items-center justify-center">
				<Loader className="size-8 animate-spin text-emerald-500" />
			</div>
		);
	}
	return <>{children}</>;
}
