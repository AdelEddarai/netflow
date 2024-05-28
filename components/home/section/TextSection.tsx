'use client';
import React from 'react';
import { useIsVisable } from '@/hooks/useIsVisable';
import { useTranslations } from 'next-intl';

interface Props {
	title: string;
	desc: string;
}

export const TextSection = ({ desc, title }: Props) => {
	const t = useTranslations('STUDY_FLOW_PAGE.SECTION');

	const { isVisable, ref } = useIsVisable();

	return (
		<section
			ref={ref}
			className='flex flex-col items-center mt-28 sm:mt-52 lg:mt-80 w-full  relative isolate text-center'>
			<h2 className='font-bold text-5xl sm:text-6xl lg:text-8xl  text-center '>{t(title)}</h2>
			<p className='text-base mt-2 sm:mt-4 sm:text-lg md:text-xl lg:text-2xl text-muted-foreground'>
				{t(desc)}
			</p>

			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-96 '>
				<div
					style={{
						clipPath:
							'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
					}}
					className={`relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#51e74b] to-[#05a51a]  sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]  transition-opacity duration-500 ${
						isVisable ? 'opacity-80 dark:opacity-60 ' : 'opacity-40 dark:opacity-30'
					}`}
				/>
			</div>
			<div
				aria-hidden='true'
				className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-56 '>
				<div
					style={{
						clipPath:
							'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
					}}
					className={`relative left-[calc(50%+13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2  bg-gradient-to-tr from-[#51e74b] to-[#05a51a]   sm:left-[calc(50%+20rem)] sm:w-[50rem] transition-opacity duration-500 ${
						isVisable ? 'opacity-80 dark:opacity-60 ' : 'opacity-40 dark:opacity-30'
					}`}
				/>
			</div>
		</section>
	);
};
