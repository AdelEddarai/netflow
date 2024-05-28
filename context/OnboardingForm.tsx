'use client';

import React, { useContext, useReducer } from 'react';
import { createContext } from 'react';
import { Session } from 'next-auth';
import {
	OnboardingFormContext,
	OnboardingFormReducer,
	Action,
	ActionType,
} from '@/types/onBoardingContext';
import { UseCase } from '@prisma/client';

interface Props {
	children: React.ReactNode;
	session: Session;
}

const initialFormState: OnboardingFormReducer = {
	currentStep: 1,
	name: null,
	surname: null,
	profileImage: null,
	useCase: null,
	workspaceName: '',
	workspaceImage: null,
};

export const OnboardingFormCtx = createContext<OnboardingFormContext | null>(null);

function onBoardingFormReducer(state: OnboardingFormReducer, action: Action) {
	const { type, payload } = action;
	switch (type) {
		case ActionType.CHNAGE_SITE:
			return {
				...state,
				currentStep: payload as 1 | 2 | 3 | 4,
			};

		case ActionType.NAME:
			return {
				...state,
				name: payload as string,
			};
		case ActionType.SURNAME:
			return {
				...state,
				surname: payload as string,
			};
		case ActionType.USECASE:
			return {
				...state,
				useCase: payload as UseCase,
			};
		case ActionType.PROFILEIMAGE:
			return {
				...state,
				profileImage: payload as string | null | undefined,
			};
		case ActionType.WORKSPACE_NAME: {
			return {
				...state,
				workspaceName: payload as string,
			};
		}
		case ActionType.WORKSPACE_IMAGE: {
			return {
				...state,
				workspaceImage: payload as string | null | undefined,
			};
		}

		default:
			return state;
	}
}

export const OnboardingFormProvider = ({ children, session }: Props) => {
	const [state, dispatch] = useReducer<React.Reducer<OnboardingFormReducer, Action>>(
		onBoardingFormReducer,
		{
			...initialFormState,
			name: session.user.name,
			surname: session.user.surname,
			profileImage: session.user.image,
		}
	);

	return (
		<OnboardingFormCtx.Provider value={{ ...state, dispatch }}>
			{children}
		</OnboardingFormCtx.Provider>
	);
};

export const useOnboardingForm = () => {
	const ctx = useContext(OnboardingFormCtx);
	if (!ctx) throw new Error('invalid use');

	return ctx;
};
