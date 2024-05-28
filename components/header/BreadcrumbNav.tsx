'use client';
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next-intl/link';
import { useTranslations } from 'next-intl';

interface Props {
	addManualRoutes?: {
		name: string;
		href: string;
		useTranslate?: boolean;
		emoji?: string;
	}[];
	workspaceHref?: string;
}

export const BreadcrumbNav = ({ addManualRoutes, workspaceHref }: Props) => {
	const paths = usePathname();
	const pathNames = paths
		.split('/')
		.filter((path) => path !== 'pl' && path !== 'workspace' && path.trim() !== '');
	const t = useTranslations('ROUTES');

	if (pathNames.length > 1)
		return (
			<>
				{addManualRoutes ? (
					<div className='flex  flex-col items-start  gap-0.5 sm:items-center sm:flex-row'>
						{addManualRoutes.map((route, i) => (
							<div className='flex items-center sm:gap-0.5 text-sm sm:text-base' key={i}>
								{i + 1 < addManualRoutes.length ? (
									<>
										<Link
											className='focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded-md py-1 px-1 sm:px-2 transition-colors duration-200 hover:bg-accent'
											href={route.href}>
											{route.useTranslate ? t(route.name) : route.name}
										</Link>
										<ChevronRight className='text-primary' />
									</>
								) : (
									<p className='font-bold text-primary px-1 sm:px-2'>
										{route.emoji && route.emoji}
										{route.useTranslate ? t(route.name) : route.name}
									</p>
								)}
							</div>
						))}
					</div>
				) : (
					<div className='flex  flex-col items-start  gap-0.5 sm:items-center sm:flex-row'>
						{pathNames.map((link, i) => {
							const href = `/${pathNames.slice(0, i + 1).join('/')}`;
							return (
								<div className='flex items-center sm:gap-0.5 text-sm sm:text-base' key={i}>
									{i + 1 < pathNames.length ? (
										<>
											<Link
												className='focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded-md py-1 px-1 sm:px-2 transition-colors duration-200 hover:bg-accent'
												href={workspaceHref && pathNames.length - 1 ? workspaceHref : href}>
												{t(link.toUpperCase())}
											</Link>
											<ChevronRight className='text-primary' />
										</>
									) : (
										<div>
											<p className='font-bold text-primary px-1 sm:px-2'>{t(link.toUpperCase())}</p>
										</div>
									)}
								</div>
							);
						})}
					</div>
				)}
			</>
		);
};
