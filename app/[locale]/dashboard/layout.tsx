import { Sidebar } from '@/components/sidebar/Sidebar';
import { ToggleSidebarProvider } from '@/context/ToggleSidebar';
import { UserActivityStatusProvider } from '@/context/UserActivityStatus';
import { UserEditableWorkspacesProvider } from '@/context/UserEditableWorkspaces';
import { Metadata } from 'next';
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";

export const metadata: Metadata = {
	title: 'Netflow - Dashboard',
	description:
		'Explore your personalized dashboard to stay organized and make the most out of your experience. Access key information, track progress, and manage your tasks seamlessly from your dashboard.',
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<UserActivityStatusProvider>
		  <UserEditableWorkspacesProvider>
			<ToggleSidebarProvider>
			  <ResizablePanelGroup direction="horizontal">
	  
				<ResizablePanel defaultSize={15}>
				  <div className="h-screen w-full overflow-hidden">
					<Sidebar />
				  </div>
				</ResizablePanel>
	  
				<ResizableHandle withHandle />
	  
				<ResizablePanel defaultSize={85}>
				  <div className="relative p-4 md:p-6 lg:px-10 flex-grow flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-background h-screen">
					{children}
				  </div>
				</ResizablePanel>
	  
			  </ResizablePanelGroup>
			</ToggleSidebarProvider>
		  </UserEditableWorkspacesProvider>
		</UserActivityStatusProvider>
	  );
	  
};

export default DashboardLayout;
