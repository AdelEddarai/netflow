import { MESSAGES_LIMIT } from '@/lib/constants';
import { ExtendedMessage } from '@/types/extended';
import { create } from 'zustand';

interface MessageState {
	ammountOfNewMessages: number;
	initialMessagesLoading: boolean;
	nextPage: number;
	hasMore: boolean;
	messages: ExtendedMessage[];
	messageToDelete: null | ExtendedMessage;
	addMessage: (message: ExtendedMessage) => void;
	setMesssages: (messages: ExtendedMessage[]) => void;
	deleteMessage: (messageId: string) => void;
	editMessage: (messageId: string, content: string) => void;
	setMessageToDelete: (messageToDelete: null | ExtendedMessage) => void;
	resortMessages: () => void;
}

export const useMessage = create<MessageState>()((set) => ({
	initialMessagesLoading: true,
	messages: [],
	ammountOfNewMessages: 0,
	hasMore: true,
	nextPage: 2,
	messageToDelete: null,
	setMesssages: (messages) =>
		set((state) => ({
			messages: [...messages, ...state.messages],
			nextPage: state.nextPage + 1,
			hasMore: messages.length >= MESSAGES_LIMIT,
		})),

	addMessage: (newMessages) =>
		set((state) => ({
			messages: [...state.messages, newMessages],
			ammountOfNewMessages: state.ammountOfNewMessages + 1,
		})),
	deleteMessage: (messageId) =>
		set((state) => {
			return {
				messages: state.messages.filter((message) => message.id !== messageId),
				ammountOfNewMessages: state.ammountOfNewMessages - 1,
			};
		}),
	editMessage: (messageId, content) => {
		set((state) => {
			const updatedMessages = state.messages.map((message) => {
				if (message.id === messageId) {
					return { ...message, content, edited: true, updatedAt: new Date() };
				} else {
					return message;
				}
			});

			return {
				messages: updatedMessages,
			};
		});
	},
	setMessageToDelete: (message) => {
		set((state) => {
			return {
				messageToDelete: message,
			};
		});
	},
	resortMessages: () => {
		set((state) => ({
			messages: [
				...state.messages.sort(
					(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				),
			].reverse(),
		}));
	},
}));
