'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { AditionalResource as AditionalResourceType } from '@/types/extended';
import { AditionalRecourceTypes } from '@prisma/client';
import { ExternalLink, FileText } from 'lucide-react';
import Link from 'next-intl/link';

interface Props {
	file: AditionalResourceType;
}

export const AditionalResource = ({ file: { name, type, url } }: Props) => {
	const [isLoading, setIsLoading] = useState(true);
	return (
		<Link
			className={`w-44 h-44 sm:w-80 sm:h-80  rounded-sm overflow-hidden bg-secondary  duration-1000 relative  ${
				type === AditionalRecourceTypes.IMAGE && isLoading ? 'animate-pulse' : 'group'
			}`}
			href={url}
			target='_blank'>
			<div className='opacity-0 group-hover:opacity-100 absolute top-0 left-0 w-full h-full z-20 backdrop-blur-sm flex justify-center items-center transition-opacity duration-300 p-4 '>
				<ExternalLink color='white' size={80} />
			</div>
			<div className=' w-full h-full  flex group-hover:scale-110 transition-transform duration-300'>
				{type === AditionalRecourceTypes.IMAGE ? (
					<Image
						onLoad={(e) => {
							setIsLoading(false);
						}}
						className='w-full  h-full   object-cover'
						src={url}
						alt=''
						width={1600}
						height={1600}
					/>
				) : (
					<div className='flex flex-col justify-center items-center w-full h-full gap-1'>
						<FileText className='w-8 h-8 sm:w-12 sm:h-12	' />
						<p className='break-all text-center text-xs sm:text-sm lg:text-base'>{name}</p>
					</div>
				)}
			</div>
		</Link>
	);
};
