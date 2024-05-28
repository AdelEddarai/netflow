'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Check, Circle } from 'lucide-react';

import { cn } from '@/lib/utils';

interface CustomRadioGroup extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
	useCheckIcon?: boolean;
	indicatorSize?: boolean;
}

const RadioGroup = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
	return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
	React.ElementRef<typeof RadioGroupPrimitive.Item>,
	CustomRadioGroup
>(({ className, children, useCheckIcon, indicatorSize, ...props }, ref) => {
	return (
		<RadioGroupPrimitive.Item
			ref={ref}
			className={cn(
				'aspect-square h-6 w-6 rounded-full border-2 border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
				className
			)}
			{...props}>
			<RadioGroupPrimitive.Indicator className='flex items-center justify-center'>
				{useCheckIcon ? (
					<Check size={14} className='text-white' />
				) : (
					<Circle className={`fill-current text-current ${indicatorSize ? '' : 'h-4 w-4'}`} />
				)}
			</RadioGroupPrimitive.Indicator>
		</RadioGroupPrimitive.Item>
	);
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
