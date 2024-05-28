'use client';
import React from 'react';
import Link from 'next-intl/link';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserPermisson } from '@prisma/client';
import { LoadingState } from '@/components/ui/loading-state';

interface Props {
	title: string;
	Icon: LucideIcon;
	userRole: UserPermisson | null;
	isLoading: boolean;
	onClick: () => void;
}

export const ShortcutContainerBtnItem = ({ Icon, title, userRole, isLoading, onClick }: Props) => {
	return (
		<Button
			disabled={isLoading}
			onClick={onClick}
			variant={'outline'}
			className={` text-sm md:text-base min-w-[10rem] sm:min-w-[13rem] h-14 p-2 rounded-lg shadow-sm  flex justify-center items-center gap-1 md:gap-2 ${
				userRole !== 'OWNER' ? 'w-1/5' : 'w-1/4'
			}`}>
			{isLoading ? (
				<LoadingState />
			) : (
				<>
					<Icon size={16} />
					<h4 className='break-words'>{title}</h4>
				</>
			)}
		</Button>
	);
};
