import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import NotFoundPage from "./pages/404/NotFoundPage";
import AdminPage from "./pages/admin/AdminPage";
import AlbumPage from "./pages/album/AlbumPage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import ChatPage from "./pages/chat/ChatPage";
import HomePage from "./pages/home/HomePage";

export default function App() {
	return (
		<>
			<Routes>
				{/* Google sign-in returns here; Clerk finishes it, then /auth-callback saves the user. */}
				<Route
					path='/sso-callback'
					element={<AuthenticateWithRedirectCallback signInUrl='/auth-callback' signUpUrl='/auth-callback' redirectUrl='/auth-callback' />}
				/>
				<Route path='/auth-callback' element={<AuthCallbackPage />} />
				<Route path='/admin' element={<AdminPage />} />

				{/* Pages inside the player layout (sidebars and playback bar) */}
				<Route element={<MainLayout />}>
					<Route path='/' element={<HomePage />} />
					<Route path='/chat' element={<ChatPage />} />
					<Route path='/albums/:albumId' element={<AlbumPage />} />
					<Route path='*' element={<NotFoundPage />} />
				</Route>
			</Routes>
			<Toaster />
		</>
	);
}
