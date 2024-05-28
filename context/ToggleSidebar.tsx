'use client';

import React, { useContext, useState } from 'react';
import { createContext } from 'react';

interface Props {
	children: React.ReactNode;
}
interface ToggleSidebarContex {
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ToggleSidebarCtx = createContext<ToggleSidebarContex | null>(null);

export const ToggleSidebarProvider = ({ children }: Props) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<ToggleSidebarCtx.Provider value={{ isOpen, setIsOpen }}>{children}</ToggleSidebarCtx.Provider>
	);
};

export const useToggleSidebar = () => {
	const ctx = useContext(ToggleSidebarCtx);
	if (!ctx) throw new Error('invalid use');

	return ctx;
};
