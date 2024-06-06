import { AddTaskShortcut } from "@/components/addTaskShortcut/AddTaskShortcut";
import { DashboardHeader } from "@/components/header/DashboardHeader";
import { checkIfUserCompletedOnboarding } from "@/lib/checkIfUserCompletedOnboarding";
import dynamic from "next/dynamic";
 
const Editor = dynamic(() => import("./__component/editor"), { ssr: false });
 
const Page = async () => {
  const session = await checkIfUserCompletedOnboarding();
  return (
    <>
    <div className="h-full w-full">
    <DashboardHeader>
				<AddTaskShortcut userId={session.user.id} />
			</DashboardHeader>

      <main className='h-full'>
      <Editor />
			</main>
      
    </div>
    </>
  );
}

export default Page


