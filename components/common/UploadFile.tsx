'use client';
import React, { useRef, useState } from 'react';
import { FormControl, FormMessage, FormItem, FormField, FormLabel } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { UploadCloud, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';

interface Props<> {
	form: UseFormReturn<any>;
	schema: z.ZodObject<any>;
	inputAccept: 'image/*' | 'pdf';
	typesDescription?: string;
	ContainerClassName?: string;
	LabelClassName?: string;
	LabelText?: string;
	useAsBtn?: boolean;
	hideFileName?: boolean;
	btnText?: string;
	btnVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | null;
	btnSize?: 'default' | 'sm' | 'lg' | 'icon' | null;
	onGetImagePreview?: (image: string) => void;
}

export function UploadFile({
	form,
	schema,
	inputAccept,
	typesDescription,
	ContainerClassName,
	LabelClassName,
	LabelText,
	useAsBtn,
	hideFileName,
	btnText,
	btnSize,
	btnVariant,
	onGetImagePreview,
}: Props) {
	const t = useTranslations('UPLOAD_FILE');
	const [dragActive, setDragActive] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [file, setFile] = useState<File | null>(null);

	const fileHandler = (providedFile: File) => {
		const result = schema
			.pick({ file: true })
			.safeParse({ file: providedFile }) as z.SafeParseReturnType<
			{
				[x: string]: any;
			},
			{
				[x: string]: any;
			}
		>;

		if (result.success) {
			form.clearErrors('file');
			form.setValue('file', providedFile);

			setFile(providedFile);

			if (onGetImagePreview) onGetImagePreview(URL.createObjectURL(providedFile));
		} else {
			const errors = result.error.flatten().fieldErrors.file;
			errors?.forEach((error) =>
				form.setError('file', {
					message: error,
				})
			);
		}
		form.trigger('file');
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;

		if (files && files[0]) {
			fileHandler(files[0]);
		}
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		const files = e.dataTransfer.files;
		if (files && files[0]) {
			fileHandler(files[0]);
		}
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
	};
	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(true);
	};

	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(true);
	};

	const removeFile = () => {
		setFile(null);
		form.setValue('file', null);
		form.trigger('file');
	};

	return (
		<FormField
			control={form.control}
			name='file'
			render={({ field }) => (
				<FormItem className='flex flex-col justify-center items-center'>
					{LabelText && <FormLabel className={LabelClassName}>{LabelText}</FormLabel>}
					<FormControl>
						{useAsBtn ? (
							<>
								<Button
									size={btnSize}
									variant={btnVariant}
									onClick={() => {
										if (inputRef.current) inputRef?.current.click();
									}}
									type='button'
									className='dark:text-white'>
									{btnText && btnText}
								</Button>
								<Input
									{...field}
									placeholder='fileInput'
									className='sr-only'
									tabIndex={-1}
									value={undefined}
									ref={inputRef}
									type='file'
									multiple={true}
									onChange={handleChange}
									accept={inputAccept}
								/>
							</>
						) : (
							<div
								className={cn(
									`${
										dragActive ? 'bg-primary/20' : 'bg-muted'
									}    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-4 sm:p-6 h-min-0 h-40 cursor-pointer hover:bg-muted/90 duration-200 transition-colors ring-offset-background rounded-md relative  border-muted-foreground border border-dashed text-muted-foreground flex flex-col  items-center w-[15rem] justify-center`,
									ContainerClassName
								)}
								onDragEnter={handleDragEnter}
								onDrop={handleDrop}
								onDragLeave={handleDragLeave}
								onDragOver={handleDragOver}
								onClick={() => {
									if (inputRef.current) inputRef?.current.click();
								}}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && inputRef.current) {
										inputRef.current.click();
									}
								}}
								tabIndex={0}
								role='presentation'>
								<Input
									{...field}
									placeholder='fileInput'
									className='sr-only'
									tabIndex={-1}
									value={undefined}
									ref={inputRef}
									type='file'
									multiple={true}
									onChange={handleChange}
									accept={inputAccept}
								/>
								<UploadCloud size={30} />
								<p className='text-sm font-semibold uppercase text-primary mt-5'>
									{btnText ? btnText : t('UPLOAD')}
								</p>
								{typesDescription && <p className='text-xs mt-1 text-center'>{typesDescription}</p>}
							</div>
						)}
					</FormControl>
					<FormMessage />
					{file && !hideFileName && (
						<div className='flex items-center flex-row space-x-5 text-sm mt-6 text-center '>
							<p>{file.name}</p>
							<Button
								className='h-8 w-8 text-destructive hover:text-destructive'
								variant='ghost'
								size='icon'
								onClick={() => removeFile()}>
								<Trash2 size={18} />
							</Button>
						</div>
					)}
				</FormItem>
			)}
		/>
	);
}
