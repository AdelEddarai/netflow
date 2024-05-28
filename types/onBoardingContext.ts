import { UseCase } from '@prisma/client';

export enum ActionType {
	CHNAGE_SITE = 'CHNAGE_SITE',
	NAME = 'NAME',
	SURNAME = 'SURNAME',
	PROFILEIMAGE = 'PROFILEIMAGE',
	USECASE = 'USECASE',
	WORKSPACE_NAME = 'WORKSPACE_NAME',
	WORKSPACE_IMAGE = 'WORKSPACE_IMAGE',
}

export interface Action {
	type: ActionType;
	payload: string | number | UseCase | undefined | null;
}

export interface OnboardingFormReducer {
	currentStep: 1 | 2 | 3 | 4;
	name?: string | null;
	surname?: string | null;
	profileImage?: string | null;
	useCase: UseCase | null;
	workspaceName: string | null;
	workspaceImage?: string | null;
}

export interface OnboardingFormContext extends OnboardingFormReducer {
	dispatch: React.Dispatch<Action>;
}
