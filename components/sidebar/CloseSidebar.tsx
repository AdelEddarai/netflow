import React from 'react';
import { Button } from '@/components/ui/button';
import { PanelLeftClose } from 'lucide-react';
import { useToggleSidebar } from '@/context/ToggleSidebar';

export const CloseSidebar = () => {
	const { isOpen, setIsOpen } = useToggleSidebar();
	return (
		<Button
			onClick={() => {
				setIsOpen(false);
			}}
			className={`absolute right-[-2.5rem] top-10 z-40 rounded-tl-none rounded-bl-none lg:hidden ${
				!isOpen ? 'hidden' : ''
			}  `}
			size={'icon'}
			variant={'secondary'}>
			<PanelLeftClose />
		</Button>
	);
};
