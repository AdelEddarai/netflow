import {
	AditionalRecourceTypes,
	CustomColors,
	Message,
	MindMap,
	Notification,
	Tag,
	Task,
	UserPermisson,
	Workspace,
	savedMindMaps,
	savedTask,
} from '@prisma/client';

export interface SubscriptionUser {
	userRole: UserPermisson;
	user: {
		id: string;
		image?: string | null;
		username: string;
	};
}

export interface SettingsWorkspace extends Workspace {
	subscribers: SubscriptionUser[];
}

export interface ShortTask {
	id: string;
	emoji: string;
	title: string;
}
export interface ShortMindMap {
	id: string;
	title: string;
}

export interface WorkspaceShortcuts extends Workspace {
	tasks: ShortTask[];
	mindMaps: ShortMindMap[];
}

export interface UserInfo {
	id: string;
	username: string;
	image?: string | null;
	name?: string | null;
	surname?: string | null;
}

export interface ExtendedTask extends Task {
	tags: Tag[];
	taskDate?: {
		id: string;
		from: Date | undefined;
		to: Date | undefined;
	};
	savedTask?: savedTask[];
	creator: UserInfo;
	updatedBy: UserInfo;
}
export interface ExtendedMindMap extends MindMap {
	tags: Tag[];
	savedMindMaps?: savedMindMaps[];
	creator: UserInfo;
	updatedBy: UserInfo;
}

export interface AssignedToTaskUser {
	user: {
		id: string;
		image: string | null;
		username: string;
		assignedToTask: {
			userId: string;
		}[];
	};
}

export interface UsersAssingedToTaskInfo extends Workspace {
	subscribers: AssignedToTaskUser[];
}

export interface AssignedToMindMapUser {
	user: {
		id: string;
		image: string | null;
		username: string;
		assignedToMindMap: {
			userId: string;
		}[];
	};
}

export interface UsersAssingedToMindMapInfo extends Workspace {
	subscribers: AssignedToMindMapUser[];
}

export type AssignedItemType = 'task' | 'mindMap';

export interface AssignedToMeDataItem {
	id: string;
	title: string;
	emoji: string;
	link: string;
	workspaceName: string;
	createdAt: Date;
	type: AssignedItemType;
	updated: {
		at: Date;
		by?: UserInfo | null;
	};
	workspaceId: string;
	starred: boolean;
}

export interface AssignedToMeTaskAndMindMaps {
	tasks: AssignedToMeDataItem[];
	mindMaps: AssignedToMeDataItem[];
}

export interface CalendarItem {
	title: string;
	taskDate: {
		id: string;
		from: Date | undefined;
		to: Date | undefined;
	} | null;
	workspaceId: string;
	workspaceName: string;
	workspaceColor: CustomColors;
	taskId: string;
}

export interface UserActiveItemList {
	id: string;
	username: string;
	image: string | null;
	userRole: UserPermisson;
}

export interface UserNotification extends Notification {
	notifayCreator: {
		id: string;
		username: string;
		image: string | null;
	};
	workspace: {
		id: string;
		name: string;
	} | null;
}

export interface FilterUser {
	id: string;
	username: string;
	image: string | null;
}

export interface WorkspaceRecentActivityAssignedToItem {
	user: {
		id: string;
		image: string | null;
		username: string;
	};
	id: string;
	userId: string;
	mindMapId?: string;
	taskId?: string;
}

export interface WorkspaceRecentActivity {
	id: string;
	title: string;
	emoji: string;
	type: AssignedItemType;
	updated: {
		at: Date;
		by?: UserInfo | null;
	};
	starred: boolean;
	tags: Tag[];
	assignedTo: WorkspaceRecentActivityAssignedToItem[];
	link: string;
}
export interface AssignedToMeTaskAndMindMapsWorkspaceRecentActivity {
	tasks: WorkspaceRecentActivity[];
	mindMaps: WorkspaceRecentActivity[];
}

export interface ExtendedWorkspace extends Workspace {
	conversation: {
		id: string;
	};
}

export interface AditionalResource {
	id: string;
	name: string;
	url: string;
	type: AditionalRecourceTypes;
}

export interface ExtendedMessage extends Message {
	aditionalRecources: AditionalResource[];
	sender: {
		id: string;
		username: string;
		image?: string | null;
	};
}

export interface HomePageImage {
	src: string;
	alt: string;
}

export interface HomeRecentActivity extends AssignedToMeDataItem {}
export interface HomeRecentTasksAndMindMapsActivity extends AssignedToMeTaskAndMindMaps {}
