'use client';

import React from 'react';
import { useOnboardingForm } from '@/context/OnboardingForm';

const steps = [1, 2, 3, 4];

export const FormStepsInfo = () => {
	const { currentStep } = useOnboardingForm();
	return (
		<div className='flex justify-center items-center gap-2 w-full'>
			{steps.map((step) => (
				<span
					key={step}
					className={`h-2.5 w-8 px-6 py-1 border rounded-md shadow-sm ${
						currentStep >= step ? 'bg-primary' : 'bg-muted'
					}`}
				/>
			))}
		</div>
	);
};
