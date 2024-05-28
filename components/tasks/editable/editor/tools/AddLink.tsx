import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { OptionBtn } from './btn/OptionBtn';
import { Link2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinkSchema, linkSchema } from '@/schema/linkSchema';
import { useForm } from 'react-hook-form';
import { Editor } from '@tiptap/react';
import { useTranslations } from 'next-intl';

interface Props {
	editor: Editor | null;
}

export const AddLink = ({ editor }: Props) => {
	const [isOpen, setIsOpen] = useState(false);

	const t = useTranslations('TASK.EDITOR.HOVER');

	const form = useForm<LinkSchema>({
		resolver: zodResolver(linkSchema),
		defaultValues: {
			link: '',
		},
	});

	const setLink = useCallback(() => {
		if (!editor) return;
		const previousUrl = editor.getAttributes('link').href;
		form.setValue('link', previousUrl ? previousUrl : '');
	}, [editor, form]);

	const saveLink = useCallback(
		(data: LinkSchema) => {
			const { link } = data;
			if (editor) editor.chain().focus().extendMarkRange('link').setLink({ href: link }).run();
			setIsOpen(false);
		},
		[editor]
	);

	const removeLink = useCallback(() => {
		if (editor) editor.chain().focus().extendMarkRange('link').unsetLink().run();
		setIsOpen(false);
	}, [editor]);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<OptionBtn onClick={setLink} hoverText={t('LINK')}>
					<Link2 size={16} />
				</OptionBtn>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Insert link</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form className='space-y-6 my-4'>
						<div className='space-y-1.5'>
							<FormField
								control={form.control}
								name='link'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input className='bg-muted' placeholder={'link'} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className='flex justify-end w-full items-center gap-2'>
							<Button
								variant={'secondary'}
								disabled={!!!editor?.getAttributes('link').href}
								onClick={removeLink}
								type='button'>
								Remove link
							</Button>
							<Button
								className='text-white'
								onClick={() => {
									form.handleSubmit(saveLink)();
								}}
								type='button'>
								Add link
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
