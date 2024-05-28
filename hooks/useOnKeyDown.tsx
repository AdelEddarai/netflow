import { RefObject, useEffect } from 'react';

export const useOnKeyDown = <T extends HTMLElement = HTMLElement>(
	ref: RefObject<T>,
	handler: (event: KeyboardEvent) => void
) => {
	useEffect(() => {
		const listener = (event: KeyboardEvent) => {
			if (ref.current && ref.current.contains(document.activeElement)) handler(event);
		};

		document.addEventListener('keydown', listener);

		return () => {
			document.removeEventListener('keydown', listener);
		};
	}, [ref, handler]);
};
