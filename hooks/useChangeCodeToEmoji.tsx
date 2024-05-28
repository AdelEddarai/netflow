'use client';
import { useMemo } from 'react';

export const useChangeCodeToEmoji = (...codes: string[]) => {
	const emojis = useMemo(() => {
		return codes.map((code) => String.fromCodePoint(parseInt(code, 16)));
	}, [codes]);

	return emojis.length === 0 ? emojis[0] : emojis;
};
