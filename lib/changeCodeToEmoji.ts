export const changeCodeToEmoji = (code: string) => {
	const isValidHex = /^[0-9a-fA-F]+$/.test(code);
	return isValidHex ? String.fromCodePoint(parseInt(code, 16)) : '1f9e0';
};
