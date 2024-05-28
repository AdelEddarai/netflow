'use client';

import * as React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from 'next-themes';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from 'next-intl';

interface Props {
	variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | null;
	size?: 'default' | 'sm' | 'lg' | 'icon' | null;
	alignHover?: 'center' | 'start' | 'end';
	alignDropdown?: 'center' | 'start' | 'end';
}

export const ThemeSwitcher = ({
	size = 'default',
	variant = 'default',
	alignHover = 'center',
	alignDropdown = 'center',
}: Props) => {
	const { setTheme } = useTheme();
	const t = useTranslations('COMMON');

	return (
		<HoverCard openDelay={250} closeDelay={250}>
			<DropdownMenu>
				<HoverCardTrigger>
					<DropdownMenuTrigger asChild>
						<Button variant={variant} size={size}>
							<Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
							<Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
							<span className='sr-only'>{t('THEME_HOVER')}</span>
						</Button>
					</DropdownMenuTrigger>
				</HoverCardTrigger>
				<DropdownMenuContent align={alignDropdown}>
					<DropdownMenuItem className='cursor-pointer' onClick={() => setTheme('light')}>
						<Sun className='mr-2' /> {t('LIGHT')}
					</DropdownMenuItem>
					<DropdownMenuItem className='cursor-pointer' onClick={() => setTheme('dark')}>
						<Moon className='mr-2' /> {t('DARK')}
					</DropdownMenuItem>
					<DropdownMenuItem className='cursor-pointer' onClick={() => setTheme('system')}>
						<Laptop className='mr-2' /> {t('SYSTEM')}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<HoverCardContent align={alignHover}>
				<span>{t('THEME_HOVER')}</span>
			</HoverCardContent>
		</HoverCard>
	);
};
