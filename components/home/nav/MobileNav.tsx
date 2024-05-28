'use client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { AppLogo } from '@/components/ui/app-logo';
import Link from 'next-intl/link';
import { LocaleSwitcher } from '@/components/switchers/LocaleSwitcher';
import { ThemeSwitcher } from '@/components/switchers/ThemeSwitcher';
import { buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { navLinks } from '@/lib/constants';
import { useState } from 'react';
import { scrolltoHash } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export const MobileNav = () => {
	const t = useTranslations('STUDY_FLOW_PAGE.NAV');

	const [open, setOpen] = useState(false);

	return (
		<div className='md:hidden py-2 px-2 w-full flex items-center justify-between'>
			<Sheet onOpenChange={setOpen} open={open}>
				<SheetTrigger asChild>
					<Button variant='ghost' size={'icon'}>
						<Menu />
					</Button>
				</SheetTrigger>
				<SheetContent side={'left'} className='h-full flex flex-col justify-between '>
					<SheetHeader>
						<SheetTitle asChild>
							<Button
								className='w-fit bg-transparent text-secondary-foreground hover:bg-transparent flex items-center gap-2 hover:scale-105 transition-transform duration-200'
								onClick={() => {
									setOpen(false);
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
						</SheetTitle>
					</SheetHeader>

					<ScrollArea className='my-4 flex-grow '>
						<div className='h-full flex flex-col gap-2'>
							{navLinks.map((link, i) => (
								<Button
									variant={'link'}
									size={'sm'}
									onClick={() => {
										setOpen(false);
										scrolltoHash(link.href);
									}}
									className='w-fit text-base text-secondary-foreground font-semibold'
									key={i}>
									{t(link.title)}
								</Button>
							))}
						</div>
					</ScrollArea>
					<div className='w-full flex flex-col gap-2'>
						<Link
							onClick={() => {
								setOpen(false);
							}}
							href={'/sign-up'}
							className={`${buttonVariants({ variant: 'default' })}`}>
							{t('SIGN_UP')}
						</Link>
						<Link
							onClick={() => {
								setOpen(false);
							}}
							href={'/sign-in'}
							className={`${buttonVariants({ variant: 'outline' })}`}>
							{t('SIGN_IN')}
						</Link>
					</div>
				</SheetContent>
			</Sheet>

			<div className=' flex items-center gap-2'>
				<LocaleSwitcher alignHover='end' alignDropdown='end' size={'icon'} variant={'outline'} />
				<ThemeSwitcher alignHover='end' alignDropdown='end' size={'icon'} variant={'outline'} />
			</div>
		</div>
	);
};
