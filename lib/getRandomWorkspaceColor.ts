import { CustomColors } from '@prisma/client';

export const colors = Object.values(CustomColors);

export const getRandomWorkspaceColor = () => {
	const randomIndex = Math.floor(Math.random() * colors.length);
	return colors[randomIndex] as CustomColors;
};
