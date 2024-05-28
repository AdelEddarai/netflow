'use client';
import { Workspace } from '@prisma/client';
import React, { useMemo } from 'react';
import { AssignedToMeWorkspace } from './AssignedToMeWorkspace';
import ActiveLink from '@/components/ui/active-link';
import { useRouter } from 'next-intl/client';
import { useSearchParams } from 'next/navigation';
import { LayoutGrid } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useGetAssignedToMeParams } from '@/hooks/useGetAssignedToMeParams';
import { useTranslations } from 'next-intl';

interface Props {
	userWorkspaces: Workspace[];
}

const RADIO_OPTIONS = [
	{
		id: 'all',
		label: 'LABEL.ALL',
	},
	{
		id: 'tasks',
		label: 'LABEL.TASKS',
	},
	{
		id: 'mind-maps',
		label: 'LABEL.MIND_MAPS',
	},
] as const;

export const AssignedToMeFilter = ({ userWorkspaces }: Props) => {
	const t = useTranslations('SIDEBAR.ASSIGNED_TO_ME');

	const { currentType, workspaceFilterParam } = useGetAssignedToMeParams();
	const router = useRouter();

	const handleRadioChange = (value: 'all' | 'tasks' | 'mind-maps') => {
		let link = '/dashboard/assigned-to-me';

		workspaceFilterParam
			? (link = `/dashboard/assigned-to-me?workspace=${workspaceFilterParam}&type=${value}`)
			: (link = `/dashboard/assigned-to-me?workspace=all&type=${value}`);

		router.replace(link);
	};

	return (
		<div className='flex flex-col gap-6 w-full'>
			<div>
				<p className='text-xs sm:text-sm uppercase text-muted-foreground '>{t('TYPE')}</p>
				<div className='flex flex-col gap-2 w-full mt-2   '>
					<RadioGroup
						value={currentType}
						onValueChange={handleRadioChange}
						defaultValue={currentType}>
						{RADIO_OPTIONS.map((radio) => (
							<div
								key={radio.id}
								className='flex items-center space-x-2 h-9 rounded-md px-3 transition-colors duration-200 hover:bg-accent hover:text-accent-foreground cursor-pointer'
								onClick={(e) => {
									const button = e.currentTarget?.firstChild as HTMLButtonElement;
									const id = button.id as 'all' | 'mind-maps' | 'tasks' | null;
									id && handleRadioChange(id);
								}}>
								<RadioGroupItem className='scale-75 md:scale-90 ' value={radio.id} id={radio.id} />
								<Label className='cursor-pointer' htmlFor={radio.id}>
									{t(radio.label)}
								</Label>
							</div>
						))}
					</RadioGroup>
				</div>
			</div>

			<div>
				<p className='text-xs sm:text-sm uppercase text-muted-foreground '>{t('WORKSPACE')}</p>
				<div className='flex flex-col gap-2 w-full mt-2 '>
					<ActiveLink
						disableActiveStateColor
						variant={'ghost'}
						size={'sm'}
						href={`/dashboard/assigned-to-me?workspace=all&type=${currentType}`}
						className={`w-full flex justify-start items-center gap-2 overflow-hidden  ${
							!workspaceFilterParam || workspaceFilterParam === 'all'
								? 'bg-secondary font-semibold'
								: ''
						}`}>
						<div
							className={`rounded-md bg-primary text-white font-bold h-7 w-7  flex justify-center items-center`}>
							<LayoutGrid size={18} />
						</div>
						<p>{t('LABEL.ALL')}</p>
					</ActiveLink>

					{userWorkspaces.map((workspace) => (
						<AssignedToMeWorkspace
							currentType={currentType}
							workspaceFilterParam={workspaceFilterParam}
							key={workspace.id}
							href='/dashboard/assigned-to-me'
							workspace={workspace}
						/>
					))}
				</div>
			</div>
		</div>
	);
};
