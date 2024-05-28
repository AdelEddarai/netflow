'use client';
import React, { useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { EmojiSelector } from '@/components/common/EmojiSelector';
import { Send, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilePreview } from './FilePreview';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useTranslations } from 'next-intl';
import { useToast } from '@/components/ui/use-toast';
import { UploadFilesButton } from './UploadFileButton';
import { AditionalResource, ExtendedMessage } from '@/types/extended';
import { useMessage } from '@/store/conversation/messages';
import { v4 as uuidv4 } from 'uuid';
import { useSession } from 'next-auth/react';
import { useOnKeyDown } from '@/hooks/useOnKeyDown';

interface Props {
	chatId: string;
}

export const NewMessageContainer = ({ chatId }: Props) => {
	const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

	const t = useTranslations('CHAT.NEW_MESSAGE');
	const m = useTranslations('MESSAGES');

	const { toast } = useToast();
	const session = useSession();

	const [lastMessageId, setLastMessageid] = useState('');
	const { addMessage, deleteMessage } = useMessage((state) => state);

	const [uploadedFiles, setUploadedFiles] = useState<AditionalResource[] | null>(null);
	const [message, setMessage] = useState('');

	const onSelectEmojiHandler = (emojiCode: string) => {
		const emoji = String.fromCodePoint(parseInt(emojiCode, 16));
		setMessage((prevMessage) => prevMessage + emoji);
	};

	const onChangeUploadedFilesHandler = (files: AditionalResource[] | null) => {
		setUploadedFiles(files);
	};

	const onRemoveFileHandler = (fileId: string) => {
		setUploadedFiles((prevFiles) => {
			return prevFiles?.filter((file) => file.id !== fileId) || null;
		});
	};

	const { mutate: newMessage } = useMutation({
		mutationFn: async () => {
			if (!session.data) return;

			const user = session.data.user;
			const id = uuidv4();
			setLastMessageid(id);

			const newMessage: ExtendedMessage = {
				id,
				edited: false,
				content: message,
				aditionalRecources: uploadedFiles ? uploadedFiles : [],
				conversationId: chatId,
				updatedAt: null,
				createdAt: new Date(),
				sender: {
					id: user.id,
					image: user.image,
					username: user.username!,
				},
				senderId: user.id,
			};

			addMessage(newMessage);
			setUploadedFiles(null);
			setMessage('');

			await axios.post('/api/conversation/new_message', newMessage);
		},

		onError: (err: AxiosError) => {
			const error = err?.response?.data ? err.response.data : 'ERRORS.DEFAULT';

			toast({
				title: m(error),
				variant: 'destructive',
			});

			deleteMessage(lastMessageId);
		},

		mutationKey: ['newMessage'],
	});

	useOnKeyDown(textAreaRef, (event) => {
		if (textAreaRef.current?.id === 'new-message-text-area' && event.key === 'Enter') {
			if (!event.shiftKey && message.trim().length > 0) {
				newMessage();
			}
		}
	});

	return (
		<div className=' w-full flex flex-col gap-2 bg-popover rounded-b-md px-4 py-2 shadow-sm border-t border-border'>
			{uploadedFiles && uploadedFiles.length > 0 && (
				<ScrollArea className='w-full '>
					<div className=' flex gap-4 pb-4  border-b border-border'>
						{uploadedFiles.map((file) => (
							<FilePreview key={file.id} file={file} onRemoveFile={onRemoveFileHandler} />
						))}
					</div>
					<ScrollBar orientation='horizontal' />
				</ScrollArea>
			)}
			<div className='w-full flex justify-between items-center gap-2'>
				<div className='flex gap-0.5  sm:gap-1'>
					<UploadFilesButton onChangeUploadedFiles={onChangeUploadedFilesHandler} />

					<EmojiSelector
						className='hidden sm:flex'
						asChild
						slide='right'
						align='end'
						onSelectedEmoji={onSelectEmojiHandler}>
						<Button className='w-8 h-8 sm:w-10 sm:h-10' size={'icon'} variant={'ghost'}>
							<Smile className='w-5 h-5 sm:w-auto sm:h-auto' />
						</Button>
					</EmojiSelector>
				</div>

				<TextareaAutosize
					onKeyDown={(e) => {
						if (e.key === 'Enter') e.preventDefault();
					}}
					autoFocus
					id='new-message-text-area'
					ref={textAreaRef}
					value={message}
					onChange={(e) => {
						setMessage(e.target.value);
					}}
					placeholder={t('PLACEHOLDER')}
					className='w-full flex-grow resize-none appearance-none overflow-hidden bg-transparent  placeholder:text-muted-foreground focus:outline-none max-h-28 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary scrollbar-track-background  '
				/>

				<div>
					<Button
						disabled={message.trim().length === 0}
						onClick={() => {
							newMessage();
						}}
						className='w-8 h-8 sm:w-10 sm:h-10'
						size={'icon'}
						variant={'ghost'}>
						<Send className='w-5 h-5 sm:w-auto sm:h-auto' />
					</Button>
				</div>
			</div>
		</div>
	);
};
