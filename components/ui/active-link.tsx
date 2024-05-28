'use client';
import React from 'react';
import Link from 'next-intl/link';
import { usePathname } from 'next-intl/client';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToggleSidebar } from '@/context/ToggleSidebar';

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	href: string;
	variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | null;
	size?: 'default' | 'sm' | 'lg' | 'icon' | null;
	include?: string;
	workspaceIcon?: boolean;
	disableActiveStateColor?: boolean;
}
const ActiveLink = React.forwardRef<HTMLAnchorElement, Props>(
	(
		{
			href,
			className,
			variant = 'default',
			size = 'default',
			children,
			include,
			workspaceIcon,
			disableActiveStateColor = false,
			...props
		}: Props,
		ref
	) => {
		const { setIsOpen } = useToggleSidebar();
		const pathname = usePathname();

		return (
			<Link
				onClick={() => {
					setIsOpen(false);
				}}
				href={href}
				className={cn(
					`${buttonVariants({
						variant,
						size,
					})} ${
						href === (pathname || (include && pathname.includes(include)))
							? workspaceIcon
								? 'font-semibold border-secondary-foreground border-2 '
								: disableActiveStateColor
								? ''
								: 'bg-secondary font-semibold'
							: ''
					} `,
					className
				)}
				ref={ref}
				{...props}>
				{children}
			</Link>
		);
	}
);

ActiveLink.displayName = 'ActiveLink';

export default ActiveLink;
