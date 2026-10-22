import { ClerkProvider } from "@clerk/clerk-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import AuthProvider from "./providers/AuthProvider.tsx";
import "./index.css";

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!clerkKey) throw new Error("VITE_CLERK_PUBLISHABLE_KEY is not set");

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ClerkProvider publishableKey={clerkKey} afterSignOutUrl='/'>
			<AuthProvider>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</AuthProvider>
		</ClerkProvider>
	</StrictMode>,
);
