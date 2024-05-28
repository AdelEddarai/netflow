'use client';
import React, { useState } from 'react';
import { useChangeCodeToEmoji } from '@/hooks/useChangeCodeToEmoji';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { UserPermisson } from '@prisma/client';
import { useTranslations } from 'next-intl';

interface Props {
	userRole: UserPermisson | null;
	worksapceName: string;
}

export const PermissionIndicator = ({ userRole, worksapceName }: Props) => {
	const t = useTranslations('PERMISSION_INDICATOR');

	const userRoleEmojis = useChangeCodeToEmoji('1f432', '1f60e', '1f920', '1f913');
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					className={` text-sm md:text-base min-w-[10rem] sm:min-w-[13rem] h-14 p-2 rounded-lg shadow-sm  flex justify-center items-center gap-1 md:gap-2 ${
						userRole !== 'OWNER' ? 'w-1/5' : 'w-1/4'
					}`}
					variant={'outline'}>
					{userRole === 'OWNER' && (
						<span>
							{userRoleEmojis[0]} {t('ROLES.OWNER')}
						</span>
					)}
					{userRole === 'ADMIN' && (
						<span>
							{userRoleEmojis[1]} {t('ROLES.ADMIN')}
						</span>
					)}
					{userRole === 'CAN_EDIT' && (
						<span>
							{userRoleEmojis[2]} {t('ROLES.CAN_EDIT')}
						</span>
					)}
					{userRole === 'READ_ONLY' && (
						<span>
							{userRoleEmojis[3]} {t('ROLES.READ_ONLY')}
						</span>
					)}
				</Button>
			</DialogTrigger>

			<DialogContent className='sm:max-w-[525px]'>
				<DialogHeader>
					<DialogTitle>
						{t('TITLE')}{' '}
						{userRole === 'OWNER' && (
							<span className='text-primary '>
								{t('ROLES.OWNER')} {userRoleEmojis[0]}
							</span>
						)}
						{userRole === 'ADMIN' && (
							<span className='text-primary'>
								{t('ROLES.ADMIN')} {userRoleEmojis[1]}
							</span>
						)}
						{userRole === 'CAN_EDIT' && (
							<span className='text-primary'>
								{t('ROLES.CAN_EDIT')} {userRoleEmojis[2]}
							</span>
						)}
						{userRole === 'READ_ONLY' && (
							<span className='text-primary'>
								{t('ROLES.READ_ONLY')} {userRoleEmojis[3]}
							</span>
						)}
					</DialogTitle>
					<DialogDescription>
						{t('DESC', { workspace: worksapceName })}{' '}
						{userRole === 'OWNER' && <span>{t('ROLES.OWNER')}</span>}
						{userRole === 'ADMIN' && <span>{t('ROLES.ADMIN')}</span>}
						{userRole === 'CAN_EDIT' && <span>{t('ROLES.CAN_EDIT')}</span>}
						{userRole === 'READ_ONLY' && <span>{t('ROLES.READ_ONLY')}</span>}
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<p>
						{userRole === 'OWNER' && <>{t('ROLES_DESC.OWNER')}</>}
						{userRole === 'ADMIN' && <>{t('ROLES_DESC.ADMIN')}</>}
						{userRole === 'CAN_EDIT' && <>{t('ROLES_DESC.CAN_EDIT')}</>}
						{userRole === 'READ_ONLY' && <>{t('ROLES_DESC.READ_ONLY')}</>}
					</p>
				</div>
				<DialogFooter>
					<Button
						onClick={() => {
							setOpen(false);
						}}
						className='w-full text-white'
						size={'lg'}>
						{t('BTN')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
