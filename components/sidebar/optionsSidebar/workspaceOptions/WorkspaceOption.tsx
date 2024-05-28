'use client';
import ActiveLink from '@/components/ui/active-link';
import { Button } from '@/components/ui/button';
import { changeCodeToEmoji } from '@/lib/changeCodeToEmoji';
import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

interface Props {
	workspaceId: string;
	children: React.ReactNode;
	defaultName: string;
	href: string;
	fields: {
		title: string;
		id: string;
		emoji?: string;
	}[];
}

export const WorkspaceOption = ({ children, fields, href, workspaceId, defaultName }: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div>
			<Button
				disabled={!fields}
				onClick={() => {
					setIsOpen((prev) => !prev);
				}}
				variant={'ghost'}
				size={'sm'}
				className='w-full justify-between'>
				<div className='flex items-center gap-2'>{children}</div>

				<ChevronDown
					className={` transition-all duration-200     ${isOpen ? 'rotate-180 ' : ''}`}
				/>
			</Button>
			<div className='ml-4 text-sm my-1 flex flex-col gap-1'>
				{fields &&
					isOpen &&
					fields.map((filed, i) => {
						const name =
							filed.title && filed.title.length > 20
								? filed.title.substring(0, 19) + '...'
								: filed.title;
						return (
							<ActiveLink
								key={i}
								href={`/dashboard/workspace/${workspaceId}/${href}/${filed.id}`}
								variant={'ghost'}
								size={'sm'}
								className='w-full flex justify-start items-center gap-2 font-normal '>
								{filed.emoji && <span>{changeCodeToEmoji(filed.emoji)}</span>}
								<span>{filed.title ? name : defaultName}</span>
							</ActiveLink>
						);
					})}
			</div>
		</div>
	);
};
