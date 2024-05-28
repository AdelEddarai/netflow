'use client';
import React from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Laptop, Moon, Sun } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface Props {
	theme: 'light' | 'dark' | 'system';
	activeTheme?: string;
	onTheme: (theme: string) => void;
	themeTitle: string;
	themeFooter: string;
}

export const ThemeCard = ({ theme, activeTheme, themeFooter, themeTitle, onTheme }: Props) => {
	const t = useTranslations('SETTINGS');

	return (
		<Card
			tabIndex={1}
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					onTheme(theme);
				}
			}}
			onClick={() => onTheme(theme)}
			className={` w-full max-w-sm sm:max-w-lg sm:w-[calc((100%/2)-1.5rem)] xl:w-[calc((100%/3)-1.5rem)] border   bg-card hover:bg-accent shadow-sm  duration-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background ${
				activeTheme === theme ? 'border-primary/50' : ''
			}
		`}>
			<CardHeader className='flex flex-row items-center justify-between  space-x-0 space-y-0 '>
				<div className='flex items-center gap-2'>
					{theme === 'light' && <Sun size={20} />}
					{theme === 'dark' && <Moon size={20} />}
					{theme === 'system' && <Laptop size={20} />}
					<CardTitle className='text-xl'>{themeTitle}</CardTitle>
				</div>
				{activeTheme === theme && <Badge variant={'default'}>{t('THEME.ACTIVE')}</Badge>}
			</CardHeader>
			<CardContent>
				<div className='bg-background w-full h-44 rounded-md border shadow-sm overflow-hidden'>
					<Image
						className='w-full h-full '
						src={
							theme === 'system'
								? '/images/systemThemeExample.jpg'
								: theme === 'light'
								? '/images/workspacePageWhite.png'
								: '/images/workspacePage.png'
						}
						alt=''
						width={1000}
						height={1000}
					/>
				</div>
			</CardContent>
			<CardFooter>
				<p>{themeFooter}</p>
			</CardFooter>
		</Card>
	);
};
