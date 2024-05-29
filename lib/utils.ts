import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import { ExtendedMessage } from '@/types/extended';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const scrolltoHash = (elementid: string) => {
	const element = document.getElementById(elementid);
	element?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
};

export const showUserInforamtion = (messages: ExtendedMessage[], messageId: string) => {
	const currentIndex = messages.findIndex((message) => message.id === messageId);
	if (currentIndex !== -1 && currentIndex > 0) {
		const prevMessage = messages[currentIndex - 1];
		const currentMessage = messages[currentIndex];

		const sameSender = prevMessage.sender.id === currentMessage.sender.id;
		if (!sameSender) return true;

		if (prevMessage.aditionalRecources.length > 0) return true;

		const prevMessageCreationTime = dayjs(prevMessage.createdAt);
		const currentMessageCreationTime = dayjs(currentMessage.createdAt);
		const timeDifference = currentMessageCreationTime.diff(prevMessageCreationTime, 'seconds');
		return timeDifference > 60;
	} else {
		return true;
	}
};

export const getMonth = (month = dayjs().month()) => {
	const year = dayjs().year();
	const firstDayOfMonth = dayjs(new Date(year, month, 1)).day();

	let currentMonthCount = 1 - firstDayOfMonth;

	const daysMatrix = new Array(5).fill([]).map(() => {
		return new Array(7).fill(null).map(() => {
			currentMonthCount++;
			return dayjs(new Date(year, month, currentMonthCount));
		});
	});

	if (firstDayOfMonth === 1) {
		const firstWeek = daysMatrix[0];
		const previousMonth = month === 0 ? 11 : month - 1;
		const previousYear = month === 0 ? year - 1 : year;
		const lastDayOfPreviousMonth = dayjs(new Date(year, previousMonth + 1, 0)).date();

		for (let i = 7 - firstWeek.length; i > 0; i--) {
			const day = lastDayOfPreviousMonth - i + 1;
			firstWeek.unshift(dayjs(new Date(previousYear, previousMonth, day)));
		}
	}

	return daysMatrix;
};
