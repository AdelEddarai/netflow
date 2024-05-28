'use client';
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import Image from 'next/image';
import { useTuncateText } from '@/hooks/useTruncateText';
import { Button } from '@/components/ui/button';
import { FileText, Trash } from 'lucide-react';
import { AditionalResource } from '@/types/extended';
import { AditionalRecourceTypes } from '@prisma/client';
import { useTranslations } from 'next-intl';

interface Props {
	file: AditionalResource;
	onRemoveFile: (fileId: string) => void;
}

export const FilePreview = ({ file: { name, type, url, id }, onRemoveFile }: Props) => {
	const t = useTranslations('CHAT.NEW_MESSAGE');

	const fileName = useTuncateText(name, 23, 8);
	return (
		<div className='p-2 sm:py-3   rounded-md bg-secondary shadow-sm  relative flex flex-col items-center'>
			<div className='w-24 h-16 sm:w-28 sm:h-20 md:w-32 md:h-24 flex justify-center items-center'>
				{type === AditionalRecourceTypes.IMAGE ? (
					<Image
						className='w-full h-full rounded-sm  object-cover'
						src={url}
						alt=''
						width={800}
						height={800}
					/>
				) : (
					<FileText className='w-8 h-8 sm:w-12 sm:h-12	' />
				)}
			</div>

			<div className='w-full mt-2'>
				<p className='break-words text-xs'>{fileName}</p>
			</div>

			<div className='z-30 absolute top-0 right-0'>
				<HoverCard openDelay={250} closeDelay={250}>
					<HoverCardTrigger asChild>
						<Button
							onClick={() => {
								onRemoveFile(id);
							}}
							className='w-8 h-8'
							variant={'destructive'}
							size={'icon'}>
							<Trash size={16} />
						</Button>
					</HoverCardTrigger>

					<HoverCardContent align='center' side='top'>
						<span>{t('DELETE_ATACHMENT')}</span>
					</HoverCardContent>
				</HoverCard>
			</div>
		</div>
	);
};
