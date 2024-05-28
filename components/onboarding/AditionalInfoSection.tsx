'use client';

import React from 'react';
import { useOnboardingForm } from '@/context/OnboardingForm';
import { FormStepsInfo } from './FormStepsInfo';
import { FirstStep } from './steps/FirstStep';
import { ThirdStep } from './steps/ThirdStep';
import { SecondStep } from './steps/SecondStep';
import { AppTitle } from '../ui/app-title';
import { Finish } from './steps/Finish';

interface Props {
	profileImage?: string | null;
}

export const AditionalInfoSection = ({ profileImage }: Props) => {
	const { currentStep } = useOnboardingForm();

	return (
		<section className='w-full lg:w-1/2 bg-card min-h-full flex flex-col justify-between items-center p-4 md:p-6 '>
			<div className='mt-12 sm:mt-8 mb-16 w-full flex flex-col items-center jus '>
				<AppTitle size={50} />
				{currentStep === 1 && <FirstStep profileImage={profileImage} />}
				{currentStep === 2 && <SecondStep />}
				{currentStep === 3 && <ThirdStep />}
				{currentStep === 4 && <Finish />}
			</div>
			<FormStepsInfo />
		</section>
	);
};
