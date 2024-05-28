'use client';
import React from 'react';
import { ArrowDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Props {
	notifications: number;
	onScrollDown: () => void;
}

export const ScrollDown = ({ notifications, onScrollDown }: Props) => {
	const t = useTranslations('CHAT');

	return (
		<div className='absolute  w-full left-1/2 bottom-16 sm:bottom-24	 translate-x-[-50%] z-30 '>
			{notifications > 0 ? (
				<div
					onClick={onScrollDown}
					className='w-fit text-center mx-auto bg-primary px-2 py-1 rounded-md cursor-pointer text-white'>
					<p>{t('NOTIFICATIONS', { notifications })}</p>
				</div>
			) : (
				<div
					onClick={onScrollDown}
					className='w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full justify-center items-center flex mx-auto border border-border cursor-pointer hover:scale-110 transition-all text-white'>
					<ArrowDown />
				</div>
			)}
		</div>
	);
};
