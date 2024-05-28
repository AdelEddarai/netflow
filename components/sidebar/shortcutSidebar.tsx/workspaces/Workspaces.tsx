import { Workspace } from '@prisma/client';
import React from 'react';
import { Worksapce } from './Worksapce';
interface Props {
	userWorkspaces: Workspace[];
	href: string;
}

export const Workspaces = ({ userWorkspaces, href }: Props) => {
	return (
		<div className=' flex flex-col gap-3'>
			{userWorkspaces.map((woksapce) => (
				<Worksapce key={woksapce.id} workspace={woksapce} href={href} />
			))}
		</div>
	);
};
