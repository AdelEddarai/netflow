'use client';
import React from 'react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useMessage } from '@/store/conversation/messages';
import { ExtendedMessage } from '@/types/extended';
import { useTranslations } from 'next-intl';

interface Props {
	onChangeEdit: (editing: boolean) => void;
	message: ExtendedMessage;
}

export const Options = ({ onChangeEdit, message }: Props) => {
	const t = useTranslations('CHAT.OPTIONS');

	const { setMessageToDelete } = useMessage((state) => state);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={'ghost'} size={'icon'}>
					<MoreHorizontal />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem
					onClick={() => {
						onChangeEdit(true);
					}}
					className='cursor-pointer'>
					{t('EDIT')}
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={() => {
						setMessageToDelete(message);
						document.getElementById('trigger-delete')?.click();
					}}
					className='text-destructive focus:bg-destructive focus:text-white cursor-pointer'>
					{t('DELETE')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
