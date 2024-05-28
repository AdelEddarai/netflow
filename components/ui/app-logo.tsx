import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
interface Props {
	className?: string;
	width?: number;
	height?: number;
}

export const AppLogo = ({ height = 800, width = 800, className }: Props) => {
	return (
		<Image
			className={cn('rounded-full object-cover self-center w-16 h-16', className)}
			alt='logo app'
			width={width}
			height={height}
			src='/studyFlow.jpg'
			priority
		/>
	);
};
