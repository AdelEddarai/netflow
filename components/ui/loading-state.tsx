import { SvgProps } from '@/types/props';
import { Loader } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';
interface Props extends SvgProps {
	loadingText?: string;
	hideLoaderIcon?: boolean;
	size?: number;
}

export const LoadingState = ({
	loadingText,
	hideLoaderIcon = false,
	className,
	size,
	...props
}: Props) => {
	return (
		<>
			{!hideLoaderIcon && (
				<Loader
					size={size}
					className={cn(`h-4 w-4 animate-spin ${loadingText ? 'mr-2':""}`, className)}
					{...props}
				/>
			)}
			{loadingText && <p>{loadingText}</p>}
		</>
	);
};
