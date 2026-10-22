import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import AmbientBackground from "./components/AmbientBackground";
import AudioPlayer from "./components/AudioPlayer";
import FriendsActivity from "./components/FriendsActivity";
import LeftSidebar from "./components/LeftSidebar";
import { PlaybackControls } from "./components/PlaybackControls";

const MOBILE_MAX_WIDTH = 768;

function useIsMobile() {
	const [mobile, setMobile] = useState(false);
	useEffect(() => {
		const check = () => setMobile(window.innerWidth < MOBILE_MAX_WIDTH);
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);
	return mobile;
}

/** Three resizable columns (library, page, friends) above the playback bar. */
export default function MainLayout() {
	const mobile = useIsMobile();
	const { isSignedIn } = useUser();
	const withFriends = !mobile && Boolean(isSignedIn);

	return (
		<div className='relative isolate flex h-dvh flex-col bg-black text-white'>
			<AmbientBackground />
			<ResizablePanelGroup direction='horizontal' className='flex h-full flex-1 overflow-hidden p-1 sm:p-2'>
				<AudioPlayer />
				<ResizablePanel id='left-sidebar' order={1} defaultSize={mobile ? 15 : 20} minSize={mobile ? 0 : 10} maxSize={mobile ? 20 : 30}>
					<LeftSidebar />
				</ResizablePanel>
				<ResizableHandle className='w-1 rounded-lg bg-transparent transition-colors sm:w-2' />
				<ResizablePanel id='main-content' order={2} defaultSize={mobile ? 85 : withFriends ? 60 : 80}>
					<Outlet />
				</ResizablePanel>
				{withFriends && (
					<>
						<ResizableHandle className='w-2 rounded-lg bg-transparent transition-colors' />
						<ResizablePanel id='friends-activity' order={3} defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
							<FriendsActivity />
						</ResizablePanel>
					</>
				)}
			</ResizablePanelGroup>
			<PlaybackControls />
		</div>
	);
}
