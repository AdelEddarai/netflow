import React from 'react';
import { AppLogo } from './app-logo';
import { cn } from '@/lib/utils';
import Link from 'next-intl/link';
interface Props {
	size?: number;
	className?: string;
	asLink?: boolean;
}

export const AppTitle = ({ className, asLink, size = 20 }: Props) => {
	return (
		<>
			{asLink ? (
				<Link
					href={'/dashboard'}
					className={cn(
						'flex justify-center items-center gap-2 text-2xl bg-red-500 relative z-10',
						className
					)}>
					<AppLogo height={size} width={size} />
					<h1>
						Study<span className='text-primary font-semibold'>Flow</span>
					</h1>
				</Link>
			) : (
				<div className={cn('flex justify-center items-center gap-2 text-2xl', className)}>
					<AppLogo height={size} width={size} />
					<h1>
						Study<span className='text-primary font-semibold'>Flow</span>
					</h1>
				</div>
			)}
		</>
	);
};
