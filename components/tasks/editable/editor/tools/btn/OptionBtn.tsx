import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
	hoverText: string;
}

const OptionBtn = forwardRef<HTMLButtonElement, Props>(
	({ onClick, children, className, hoverText, ...props }: Props, ref) => {
		return (
			<HoverCard openDelay={250} closeDelay={250}>
				<HoverCardTrigger asChild>
					<Button
						ref={ref}
						className={cn(
							'w-7  h-7 flex justify-center items-center rounded-sm text-muted-foreground',
							className
						)}
						type='button'
						size={'icon'}
						variant={'ghost'}
						onClick={onClick}
						{...props}>
						{children}
					</Button>
				</HoverCardTrigger>
				<HoverCardContent className='text-sm' align='start' side='top' sideOffset={10}>
					{hoverText}
				</HoverCardContent>
			</HoverCard>
		);
	}
);
OptionBtn.displayName = 'OptionButton';

export { OptionBtn };
