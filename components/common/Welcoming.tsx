'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next-intl/client';
import { useFormatter, useTranslations } from 'next-intl';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
	hideOnMobile?: boolean;
	hideOnDesktop?: boolean;
	showOnlyOnPath?: string;
	username: string;
	name?: string | null;
	surname?: string | null;
}

const Welcoming = React.forwardRef<HTMLDivElement, Props>(
	(
		{
			className,
			hideOnMobile,
			hideOnDesktop,
			showOnlyOnPath,
			username,
			name,
			surname,
			...props
		}: Props,
		ref
	) => {
		const t = useTranslations('COMMON');
		const dateTime = new Date();
		const format = useFormatter();

		const day = format.dateTime(dateTime, {
			dateStyle: 'full',
		});

		const pathname = usePathname();
		if (showOnlyOnPath && pathname !== showOnlyOnPath) return null;
		else
			return (
				<div
					ref={ref}
					className={cn(
						`space-y-1 ${hideOnDesktop ? ' lg:hidden' : ''}  ${
							hideOnMobile ? 'hidden lg:block' : ''
						} `,
						className
					)}
					{...props}>
					<p className='font-bold text-2xl sm:text-3xl'>
						{t('WELCOME_BACK')}{' '}
						<span>{name ? (name && surname ? `${name} ${surname}` : name) : username}</span> 👋
					</p>
					<p className='text-muted-foreground text-sm sm:text-base sm:max-w-xl '>
						{day[0].toUpperCase() + day.slice(1)}
					</p>
				</div>
			);
	}
);

Welcoming.displayName = 'Welcoming';

export default Welcoming;
