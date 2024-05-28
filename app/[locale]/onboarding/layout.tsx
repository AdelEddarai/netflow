import { LocaleSwitcher } from '@/components/switchers/LocaleSwitcher';
import { ThemeSwitcher } from '@/components/switchers/ThemeSwitcher';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'StudyFlow - Onboarding',
	description:
		'Complete the account setup process and start your journey with us. Finish setting up your account to access all features and begin exploring what our platform has to offer.',
};


const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className='flex min-h-screen w-full'>
			<div className='absolute top-0 left-0 w-full flex justify-end'>
				<div className='flex items-center gap-2 max-w-7xl p-4 md:p-6'>
					<LocaleSwitcher alignHover='end' alignDropdown='end' size={'icon'} variant={'outline'} />
					<ThemeSwitcher alignHover='end' alignDropdown='end' size={'icon'} variant={'outline'} />
				</div>
			</div>
			{children}
		</main>
	);
};

export default OnboardingLayout;
