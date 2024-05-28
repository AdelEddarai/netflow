'use client';
import React from 'react';
import Link from 'next-intl/link';
import { LucideIcon } from 'lucide-react';
import { UserPermisson } from '@prisma/client';
import { buttonVariants } from '@/components/ui/button';

interface Props {
	title: string;
	Icon: LucideIcon;
	userRole: UserPermisson | null;
	href: string;
}

export const ShortcutContainerLinkItem = ({ Icon, title, userRole, href }: Props) => {
	return (
		<Link
			href={href}
			className={`${buttonVariants({
				variant: 'outline',
			})} text-sm md:text-base min-w-[10rem] sm:min-w-[13rem] h-14 p-2 rounded-lg shadow-sm  flex justify-center items-center gap-1 md:gap-2 ${
				userRole !== 'OWNER' ? 'w-1/5' : 'w-1/4'
			} `}>
			<Icon size={16} />
			<h4 className='break-words'>{title}</h4>
		</Link>
	);
};
