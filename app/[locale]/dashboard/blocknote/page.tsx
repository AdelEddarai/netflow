import { AddTaskShortcut } from "@/components/addTaskShortcut/AddTaskShortcut";
import { DashboardHeader } from "@/components/header/DashboardHeader";
import { checkIfUserCompletedOnboarding } from "@/lib/checkIfUserCompletedOnboarding";
import dynamic from "next/dynamic";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Suspense } from "react";
import { LoadingState } from "@/components/ui/loading-state";
import { Metadata } from "next";
import TldrawBlock from "./__component/TldrawBlock";

const Editor = dynamic(() => import("./__component/editor"), { ssr: false });

export const metadata: Metadata = {
  title: 'Netflow - Blocknote',
};

const Page = async () => {
  const session = await checkIfUserCompletedOnboarding();
  

  return (
    <div className="h-full w-full flex flex-col">
      <DashboardHeader>
        <AddTaskShortcut userId={session.user.id} />
      </DashboardHeader>

      <main className='flex-grow'>
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={99}>
            <Suspense fallback={<LoadingState className='w-12 h-12' />}>
            <Editor userId={session.user.id} />
            </Suspense>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={1}>
            <TldrawBlock />
          </ResizablePanel>
          <ResizableHandle />
        </ResizablePanelGroup>
      </main>
    </div>
  );
}

export default Page;