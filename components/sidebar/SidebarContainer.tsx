'use client';
import React from 'react';
import { ShortcutSidebar } from './shortcutSidebar.tsx/ShortcutSidebar';
import { OptionsSidebar } from './optionsSidebar/OptionsSidebar';
import { useToggleSidebar } from '@/context/ToggleSidebar';
import { CloseSidebar } from './CloseSidebar';
import { Workspace } from '@prisma/client';

interface Props {
	userWorkspaces: Workspace[];
	userAdminWorkspaces: Workspace[];
	userId: string;
}

export const SidebarContainer = ({ userWorkspaces, userAdminWorkspaces, userId }: Props) => {
	const { isOpen, setIsOpen } = useToggleSidebar();
	const createdWorkspaces = userWorkspaces.filter((workspace) => workspace.creatorId === userId);
	return (
		<>
			<aside
				className={`fixed  z-50 top-0 left-0 lg:static h-full bg-background border-r   flex   lg:translate-x-0 transition-all duration-300      ${
					isOpen ? 'translate-x-0 shadow-sm' : 'translate-x-[-100%]'
				}`}>
				<ShortcutSidebar
					userWorkspaces={userWorkspaces}
					createdWorkspaces={createdWorkspaces.length}
				/>
				<OptionsSidebar
					createdWorkspaces={createdWorkspaces.length}
					userAdminWorkspaces={userAdminWorkspaces}
					userWorkspaces={userWorkspaces}
				/>
				<CloseSidebar />
			</aside>
			<div
				onClick={() => {
					setIsOpen(false);
				}}
				className={`fixed h-screen w-full top-0 left-0 bg-black/80 z-40 lg:hidden ${
					isOpen ? 'block' : 'hidden'
				} `}></div>
		</>
	);
};
