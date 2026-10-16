import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
import AmbientBackground from "./components/AmbientBackground";
import { PlaybackControls } from "./components/PlaybackControls";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

const MainLayout = () => {
	const [isMobile, setIsMobile] = useState(false);
	const { isSignedIn } = useUser();
	const showFriends = !isMobile && isSignedIn;

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	return (
		<div className='relative isolate h-screen bg-black text-white flex flex-col'>
			<AmbientBackground />
			<ResizablePanelGroup direction='horizontal' className='flex-1 flex h-full overflow-hidden p-1 sm:p-2'>
				<AudioPlayer />
				{/* left sidebar */}
				<ResizablePanel
					id='left-sidebar'
					order={1}
					defaultSize={isMobile ? 15 : 20}
					minSize={isMobile ? 0 : 10}
					maxSize={isMobile ? 20 : 30}
				>
					<LeftSidebar />
				</ResizablePanel>

				<ResizableHandle className='w-1 sm:w-2 bg-transparent rounded-lg transition-colors' />

				{/* Main content */}
				<ResizablePanel id='main-content' order={2} defaultSize={isMobile ? 85 : showFriends ? 60 : 80}>
					<Outlet />
				</ResizablePanel>

				{showFriends && (
					<>
						<ResizableHandle className='w-2 bg-transparent rounded-lg transition-colors' />

						{/* right sidebar */}
						<ResizablePanel id='friends-activity' order={3} defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
							<FriendsActivity />
						</ResizablePanel>
					</>
				)}
			</ResizablePanelGroup>

			<PlaybackControls />
		</div>
	);
};
export default MainLayout;
