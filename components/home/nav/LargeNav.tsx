'use client';
import React from 'react';
import { AppLogo } from '@/components/ui/app-logo';
import Link from 'next-intl/link';
import { LocaleSwitcher } from '@/components/switchers/LocaleSwitcher';
import { ThemeSwitcher } from '@/components/switchers/ThemeSwitcher';
import { Button, buttonVariants } from '@/components/ui/button';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { navLinks } from '@/lib/constants';
import { scrolltoHash } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export const LargeNav = () => {
	const t = useTranslations('STUDY_FLOW_PAGE.NAV');

	return (
		<div className='container py-4 md:flex  max-w-screen-2xl items-center justify-between hidden'>
			<div className='flex items-center'>
				<Button
					className='w-fit bg-transparent text-secondary-foreground hover:bg-transparent flex items-center gap-2 hover:scale-105 transition-transform duration-200'
					onClick={() => {
						window.scrollTo({
							top: 0,
							behavior: 'smooth',
						});
					}}>
					<AppLogo className='w-10 h-10' />
					<p className='text-2xl font-semibold'>
						Study<span className='text-primary'>Flow</span>
					</p>
				</Button>
				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuTrigger className='text-lg'>
								{t('PRODUCT.TITLE')}
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className='grid w-[400px] gap-3 p-4 md:grid-cols-2  '>
									{navLinks.map((link, i) => (
										<div key={i}>
											<Button
												onClick={() => {
													scrolltoHash(link.href);
												}}
												className='w-full text-left bg-transparent text-secondary-foreground justify-start select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'>
												{t(link.title)}
											</Button>
										</div>
									))}
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
			</div>
			<div className='flex items-center gap-4'>
				<div className='flex items-center gap-4'>
					<Link
						href={'/sign-in'}
						className='border-b inline-block border-transparent hover:border-primary duration-200 transition-colors'>
						{t('SIGN_IN')}
					</Link>
					<Link href={'/sign-up'} className={`${buttonVariants({ variant: 'default' })}`}>
						{t('SIGN_UP')}
					</Link>
				</div>
				<div className=' flex items-center gap-2'>
					<LocaleSwitcher alignHover='end' alignDropdown='end' size={'icon'} variant={'outline'} />
					<ThemeSwitcher alignHover='end' alignDropdown='end' size={'icon'} variant={'outline'} />
				</div>
			</div>
		</div>
	);
};
