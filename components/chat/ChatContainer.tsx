'use client';
import React, { useEffect, useRef } from 'react';
import { NewMessageContainer } from './newMessage/NewMessageContainer';
import { MessagesContainer } from './messages/MessagesContainer';
import { Header } from './header/Header';
import { ExtendedMessage } from '@/types/extended';
import { MESSAGES_LIMIT } from '@/lib/constants';
import { useMessage } from '@/store/conversation/messages';

interface Props {
	workspaceName: string;
	chatId: string;
	initialMessages: ExtendedMessage[];
	sessionUserId: string;
}

export const ChatContainer = ({ chatId, initialMessages, sessionUserId, workspaceName }: Props) => {
	const initState = useRef(false);
	const hasMore = initialMessages.length >= MESSAGES_LIMIT;

	useEffect(() => {
		if (!initState.current) {
			useMessage.setState({
				messages: initialMessages.reverse(),
				hasMore,
				initialMessagesLoading: false,
			});
		}
		initState.current = true;
		// eslint-disable-next-line
	}, []);

	return (
		<div className='w-full h-full flex flex-col justify-between  border border-border rounded-md shadow-sm relative'>
			<Header workspaceName={workspaceName} />
			<MessagesContainer chatId={chatId} sessionUserId={sessionUserId} />
			<NewMessageContainer chatId={chatId} />
		</div>
	);
};
