'use client';
import React from 'react';
import { ImagesCarusel } from '../carusel/ImagesCarusel';
import { HomePageImage } from '@/types/extended';
import { useIsVisable } from '@/hooks/useIsVisable';
import { useTranslations } from 'next-intl';
interface Props {
	title: string;
	desc: string;
	reverse?: boolean;
	images: HomePageImage[];
	id?: string;
}

export const Section = ({ reverse, images, desc, title, id }: Props) => {
	const t = useTranslations('STUDY_FLOW_PAGE.SECTION');

	const { isVisable, ref } = useIsVisable();

	return (
		<section
			id={id}
			ref={ref}
			className={`mt-28 sm:mt-52 lg:mt-80 flex-col    flex justify-between items-center gap-6 md:gap-10 ${
				reverse ? 'lg:flex-row' : 'lg:flex-row-reverse'
			}`}>
			<div className='w-full lg:w-2/5 flex flex-col gap-1 sm:gap-4'>
				<h2 className=' text-2xl sm:text-3xl lg:text-4xl font-semibold'>{t(title)}</h2>
				<p className='text-sm sm:text-base md:text-lg text-muted-foreground'>{t(desc)}</p>
			</div>
			<div className='w-full lg:w-3/5 relative isolate  '>
				<ImagesCarusel images={images} />

				<div
					aria-hidden='true'
					className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl lg:-top-40'>
					<div
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
						}}
						className={`relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#51e74b] to-[#05a51a]  lg:left-[calc(50%-30rem)] lg:w-[72.1875rem] transition-opacity duration-500 ${
							isVisable ? 'opacity-80 dark:opacity-60 ' : 'opacity-40 dark:opacity-30'
						}`}
					/>
				</div>
				<div
					aria-hidden='true'
					className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl lg:-top-96'>
					<div
						style={{
							clipPath:
								'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
						}}
						className={`relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#51e74b] to-[#05a51a]  lg:left-[calc(50%-30rem)] lg:w-[72.1875rem] transition-opacity duration-500 ${
							isVisable ? 'opacity-80 dark:opacity-60 ' : 'opacity-40 dark:opacity-30'
						}`}
					/>
				</div>
			</div>
		</section>
	);
};
