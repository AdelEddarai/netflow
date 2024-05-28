'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { PanelLeftOpen } from 'lucide-react';
import { useToggleSidebar } from '@/context/ToggleSidebar';

export const OpenSidebar = () => {
	const { setIsOpen } = useToggleSidebar();
	return (
		<Button
			onClick={() => {
				setIsOpen(true);
			}}
			className='text-muted-foreground lg:hidden'
			variant={'ghost'}
			size={'icon'}>
			<PanelLeftOpen />
		</Button>
	);
};
