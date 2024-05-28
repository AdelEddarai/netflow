export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			_MindMapToTag: {
				Row: {
					A: string;
					B: string;
				};
				Insert: {
					A: string;
					B: string;
				};
				Update: {
					A?: string;
					B?: string;
				};
				Relationships: [
					{
						foreignKeyName: '_MindMapToTag_A_fkey';
						columns: ['A'];
						isOneToOne: false;
						referencedRelation: 'MindMap';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: '_MindMapToTag_B_fkey';
						columns: ['B'];
						isOneToOne: false;
						referencedRelation: 'Tag';
						referencedColumns: ['id'];
					}
				];
			};
			_prisma_migrations: {
				Row: {
					applied_steps_count: number;
					checksum: string;
					finished_at: string | null;
					id: string;
					logs: string | null;
					migration_name: string;
					rolled_back_at: string | null;
					started_at: string;
				};
				Insert: {
					applied_steps_count?: number;
					checksum: string;
					finished_at?: string | null;
					id: string;
					logs?: string | null;
					migration_name: string;
					rolled_back_at?: string | null;
					started_at?: string;
				};
				Update: {
					applied_steps_count?: number;
					checksum?: string;
					finished_at?: string | null;
					id?: string;
					logs?: string | null;
					migration_name?: string;
					rolled_back_at?: string | null;
					started_at?: string;
				};
				Relationships: [];
			};
			_TagToTask: {
				Row: {
					A: string;
					B: string;
				};
				Insert: {
					A: string;
					B: string;
				};
				Update: {
					A?: string;
					B?: string;
				};
				Relationships: [
					{
						foreignKeyName: '_TagToTask_A_fkey';
						columns: ['A'];
						isOneToOne: false;
						referencedRelation: 'Tag';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: '_TagToTask_B_fkey';
						columns: ['B'];
						isOneToOne: false;
						referencedRelation: 'Task';
						referencedColumns: ['id'];
					}
				];
			};
			Account: {
				Row: {
					access_token: string | null;
					expires_at: number | null;
					id: string;
					id_token: string | null;
					provider: string;
					provider_account_id: string;
					refresh_token: string | null;
					scope: string | null;
					session_state: string | null;
					token_type: string | null;
					type: string;
					userId: string;
				};
				Insert: {
					access_token?: string | null;
					expires_at?: number | null;
					id: string;
					id_token?: string | null;
					provider: string;
					provider_account_id: string;
					refresh_token?: string | null;
					scope?: string | null;
					session_state?: string | null;
					token_type?: string | null;
					type: string;
					userId: string;
				};
				Update: {
					access_token?: string | null;
					expires_at?: number | null;
					id?: string;
					id_token?: string | null;
					provider?: string;
					provider_account_id?: string;
					refresh_token?: string | null;
					scope?: string | null;
					session_state?: string | null;
					token_type?: string | null;
					type?: string;
					userId?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'Account_userId_fkey';
						columns: ['userId'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					}
				];
			};
			aditionalRecource: {
				Row: {
					id: string;
					messageId: string | null;
					name: string;
					type: Database['public']['Enums']['AditionalRecourceTypes'];
					url: string;
				};
				Insert: {
					id: string;
					messageId?: string | null;
					name: string;
					type: Database['public']['Enums']['AditionalRecourceTypes'];
					url: string;
				};
				Update: {
					id?: string;
					messageId?: string | null;
					name?: string;
					type?: Database['public']['Enums']['AditionalRecourceTypes'];
					url?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'aditionalRecource_messageId_fkey';
						columns: ['messageId'];
						isOneToOne: false;
						referencedRelation: 'Message';
						referencedColumns: ['id'];
					}
				];
			};
			assignedToMindMap: {
				Row: {
					id: string;
					mindMapId: string;
					userId: string;
				};
				Insert: {
					id: string;
					mindMapId: string;
					userId: string;
				};
				Update: {
					id?: string;
					mindMapId?: string;
					userId?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'assignedToMindMap_mindMapId_fkey';
						columns: ['mindMapId'];
						isOneToOne: false;
						referencedRelation: 'MindMap';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'assignedToMindMap_userId_fkey';
						columns: ['userId'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					}
				];
			};
			assignedToTask: {
				Row: {
					id: string;
					taskId: string;
					userId: string;
				};
				Insert: {
					id: string;
					taskId: string;
					userId: string;
				};
				Update: {
					id?: string;
					taskId?: string;
					userId?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'assignedToTask_taskId_fkey';
						columns: ['taskId'];
						isOneToOne: false;
						referencedRelation: 'Task';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'assignedToTask_userId_fkey';
						columns: ['userId'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					}
				];
			};
			Conversation: {
				Row: {
					id: string;
					workspaceId: string;
				};
				Insert: {
					id: string;
					workspaceId: string;
				};
				Update: {
					id?: string;
					workspaceId?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'Conversation_workspaceId_fkey';
						columns: ['workspaceId'];
						isOneToOne: false;
						referencedRelation: 'Workspace';
						referencedColumns: ['id'];
					}
				];
			};
			Message: {
				Row: {
					content: string;
					conversationId: string;
					createdAt: string;
					edited: boolean;
					id: string;
					senderId: string;
					updatedAt: string | null;
				};
				Insert: {
					content: string;
					conversationId: string;
					createdAt?: string;
					edited?: boolean;
					id: string;
					senderId: string;
					updatedAt?: string | null;
				};
				Update: {
					content?: string;
					conversationId?: string;
					createdAt?: string;
					edited?: boolean;
					id?: string;
					senderId?: string;
					updatedAt?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'Message_conversationId_fkey';
						columns: ['conversationId'];
						isOneToOne: false;
						referencedRelation: 'Conversation';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Message_senderId_fkey';
						columns: ['senderId'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					}
				];
			};
			MindMap: {
				Row: {
					content: Json | null;
					createdAt: string;
					creatorId: string;
					emoji: string;
					id: string;
					title: string;
					updatedAt: string;
					updatedUserId: string | null;
					workspaceId: string;
				};
				Insert: {
					content?: Json | null;
					createdAt?: string;
					creatorId: string;
					emoji?: string;
					id: string;
					title: string;
					updatedAt: string;
					updatedUserId?: string | null;
					workspaceId: string;
				};
				Update: {
					content?: Json | null;
					createdAt?: string;
					creatorId?: string;
					emoji?: string;
					id?: string;
					title?: string;
					updatedAt?: string;
					updatedUserId?: string | null;
					workspaceId?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'MindMap_creatorId_fkey';
						columns: ['creatorId'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'MindMap_updatedUserId_fkey';
						columns: ['updatedUserId'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'MindMap_workspaceId_fkey';
						columns: ['workspaceId'];
						isOneToOne: false;
						referencedRelation: 'Workspace';
						referencedColumns: ['id'];
					}
				];
			};
			Notification: {
				Row: {
					cliked: boolean;
					createdDate: string;
					id: string;
					mindMapId: string | null;
					newUserRole: Database['public']['Enums']['UserPermisson'] | null;
					notfiyType: Database['public']['Enums']['NotfiyType'];
					notifayCreatorId: string;
					seen: boolean;
					taskId: string | null;
					userId: string;
					workspaceId: string | null;
				};
				Insert: {
					cliked?: boolean;
					createdDate?: string;
					id: string;
					mindMapId?: string | null;
					newUserRole?: Database['public']['Enums']['UserPermisson'] | null;
					notfiyType: Database['public']['Enums']['NotfiyType'];
					notifayCreatorId: string;
					seen?: boolean;
					taskId?: string | null;
					userId: string;
					workspaceId?: string | null;
				};
				Update: {
					cliked?: boolean;
					createdDate?: string;
					id?: string;
					mindMapId?: string | null;
					newUserRole?: Database['public']['Enums']['UserPermisson'] | null;
					notfiyType?: Database['public']['Enums']['NotfiyType'];
					notifayCreatorId?: string;
					seen?: boolean;
					taskId?: string | null;
					userId?: string;
					workspaceId?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'Notification_notifayCreatorId_fkey';
						columns: ['notifayCreatorId'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Notification_userId_fkey';
						columns: ['userId'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Notification_workspaceId_fkey';
						columns: ['workspaceId'];
						isOneToOne: false;
						referencedRelation: 'Workspace';
						referencedColumns: ['id'];
					}
				];
			};
			PomodoroSettings: {
				Row: {
					id: string;
					longBreakDuration: number;
					longBreakInterval: number;
					rounds: number;
					shortBreakDuration: number;
					soundEffect: Database['public']['Enums']['PomodoroSoundEffect'];
					soundEffectVloume: number;
					userId: string;
					workDuration: number;
				};
				Insert: {
					id: string;
					longBreakDuration?: number;
					longBreakInterval?: number;
					rounds?: number;
					shortBreakDuration?: number;
					soundEffect?: Database['public']['Enums']['PomodoroSoundEffect'];
					soundEffectVloume?: number;
					userId: string;
					workDuration?: number;
				};
				Update: {
					id?: string;
					longBreakDuration?: number;
					longBreakInterval?: number;
					rounds?: number;
					shortBreakDuration?: number;
					soundEffect?: Database['public']['Enums']['PomodoroSoundEffect'];
					soundEffectVloume?: number;
					userId?: string;
					workDuration?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'PomodoroSettings_userId_fkey';
						columns: ['userId'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					}
				];
			};
			savedMindMaps: {
				Row: {
					id: string;
					mindMapId: string;
					userId: string;
				};
				Insert: {
					id: string;
					mindMapId: string;
					userId: string;
				};
				Update: {
					id?: string;
					mindMapId?: string;
					userId?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'savedMindMaps_mindMapId_fkey';
						columns: ['mindMapId'];
						isOneToOne: false;
						referencedRelation: 'MindMap';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'savedMindMaps_userId_fkey';
						columns: ['userId'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					}
				];
			};
			savedTask: {
				Row: {
					id: string;
					taskId: string;
					userId: string;
				};
				Insert: {
					id: string;
					taskId: string;
					userId: string;
				};
				Update: {
					id?: string;
					taskId?: string;
					userId?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'savedTask_taskId_fkey';
						columns: ['taskId'];
						isOneToOne: false;
						referencedRelation: 'Task';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'savedTask_userId_fkey';
						columns: ['userId'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					}
				];
			};
			Session: {
				Row: {
					expires: string;
					id: string;
					sessionToken: string;
					userId: string;
				};
				Insert: {
					expires: string;
					id: string;
					sessionToken: string;
					userId: string;
				};
				Update: {
					expires?: string;
					id?: string;
					sessionToken?: string;
					userId?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'Session_userId_fkey';
						columns: ['userId'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					}
				];
			};
			Subscription: {
				Row: {
					userId: string;
					userRole: Database['public']['Enums']['UserPermisson'];
					workspaceId: string;
				};
				Insert: {
					userId: string;
					userRole?: Database['public']['Enums']['UserPermisson'];
					workspaceId: string;
				};
				Update: {
					userId?: string;
					userRole?: Database['public']['Enums']['UserPermisson'];
					workspaceId?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'Subscription_userId_fkey';
						columns: ['userId'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Subscription_workspaceId_fkey';
						columns: ['workspaceId'];
						isOneToOne: false;
						referencedRelation: 'Workspace';
						referencedColumns: ['id'];
					}
				];
			};
			Tag: {
				Row: {
					color: Database['public']['Enums']['CustomColors'];
					id: string;
					name: string;
					workspaceId: string;
				};
				Insert: {
					color: Database['public']['Enums']['CustomColors'];
					id: string;
					name: string;
					workspaceId: string;
				};
				Update: {
					color?: Database['public']['Enums']['CustomColors'];
					id?: string;
					name?: string;
					workspaceId?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'Tag_workspaceId_fkey';
						columns: ['workspaceId'];
						isOneToOne: false;
						referencedRelation: 'Workspace';
						referencedColumns: ['id'];
					}
				];
			};
			Task: {
				Row: {
					content: Json | null;
					createdAt: string;
					creatorId: string;
					dateId: string | null;
					emoji: string;
					id: string;
					title: string;
					updatedAt: string;
					updatedUserId: string | null;
					workspaceId: string;
				};
				Insert: {
					content?: Json | null;
					createdAt?: string;
					creatorId: string;
					dateId?: string | null;
					emoji?: string;
					id: string;
					title: string;
					updatedAt: string;
					updatedUserId?: string | null;
					workspaceId: string;
				};
				Update: {
					content?: Json | null;
					createdAt?: string;
					creatorId?: string;
					dateId?: string | null;
					emoji?: string;
					id?: string;
					title?: string;
					updatedAt?: string;
					updatedUserId?: string | null;
					workspaceId?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'Task_creatorId_fkey';
						columns: ['creatorId'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Task_dateId_fkey';
						columns: ['dateId'];
						isOneToOne: false;
						referencedRelation: 'TaskDate';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Task_updatedUserId_fkey';
						columns: ['updatedUserId'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'Task_workspaceId_fkey';
						columns: ['workspaceId'];
						isOneToOne: false;
						referencedRelation: 'Workspace';
						referencedColumns: ['id'];
					}
				];
			};
			TaskDate: {
				Row: {
					from: string | null;
					id: string;
					to: string | null;
				};
				Insert: {
					from?: string | null;
					id: string;
					to?: string | null;
				};
				Update: {
					from?: string | null;
					id?: string;
					to?: string | null;
				};
				Relationships: [];
			};
			User: {
				Row: {
					completedOnboarding: boolean;
					email: string | null;
					emailVerified: string | null;
					hashedPassword: string | null;
					id: string;
					image: string | null;

					name: string | null;
					surname: string | null;
					useCase: Database['public']['Enums']['UseCase'] | null;
					username: string;
				};
				Insert: {
					completedOnboarding?: boolean;
					email?: string | null;
					emailVerified?: string | null;
					hashedPassword?: string | null;
					id: string;
					image?: string | null;
					name?: string | null;
					surname?: string | null;
					useCase?: Database['public']['Enums']['UseCase'] | null;
					username: string;
				};
				Update: {
					completedOnboarding?: boolean;
					email?: string | null;
					emailVerified?: string | null;
					hashedPassword?: string | null;
					id?: string;
					image?: string | null;
					name?: string | null;
					surname?: string | null;
					useCase?: Database['public']['Enums']['UseCase'] | null;
					username?: string;
				};
				Relationships: [];
			};
			VerificationToken: {
				Row: {
					expires: string;
					identifier: string;
					token: string;
				};
				Insert: {
					expires: string;
					identifier: string;
					token: string;
				};
				Update: {
					expires?: string;
					identifier?: string;
					token?: string;
				};
				Relationships: [];
			};
			Workspace: {
				Row: {
					adminCode: string;
					canEditCode: string;
					color: Database['public']['Enums']['CustomColors'];
					createdAt: string;
					creatorId: string | null;
					id: string;
					image: string | null;
					inviteCode: string;
					name: string;
					readOnlyCode: string;
					updatedAt: string;
				};
				Insert: {
					adminCode: string;
					canEditCode: string;
					color?: Database['public']['Enums']['CustomColors'];
					createdAt?: string;
					creatorId?: string | null;
					id: string;
					image?: string | null;
					inviteCode: string;
					name: string;
					readOnlyCode: string;
					updatedAt: string;
				};
				Update: {
					adminCode?: string;
					canEditCode?: string;
					color?: Database['public']['Enums']['CustomColors'];
					createdAt?: string;
					creatorId?: string | null;
					id?: string;
					image?: string | null;
					inviteCode?: string;
					name?: string;
					readOnlyCode?: string;
					updatedAt?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'Workspace_creatorId_fkey';
						columns: ['creatorId'];
						isOneToOne: false;
						referencedRelation: 'User';
						referencedColumns: ['id'];
					}
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			AditionalRecourceTypes: 'PDF' | 'IMAGE';
			CustomColors:
				| 'PURPLE'
				| 'RED'
				| 'GREEN'
				| 'BLUE'
				| 'PINK'
				| 'YELLOW'
				| 'ORANGE'
				| 'CYAN'
				| 'FUCHSIA'
				| 'LIME'
				| 'EMERALD'
				| 'INDIGO';
			NotfiyType:
				| 'NEW_USER_IN_WORKSPACE'
				| 'USER_LEFT_WORKSPACE'
				| 'NEW_TASK'
				| 'NEW_MIND_MAP'
				| 'NEW_ROLE'
				| 'NEW_ASSIGMENT_TASK'
				| 'NEW_ASSIGMENT_MIND_MAP';
			PomodoroSoundEffect: 'ANALOG' | 'BIRD' | 'CHURCH_BELL' | 'DIGITAL' | 'FANCY' | 'BELL';
			UseCase: 'WORK' | 'STUDY' | 'PERSONAL_USE';
			UserPermisson: 'ADMIN' | 'CAN_EDIT' | 'READ_ONLY' | 'OWNER';
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

export type Tables<
	PublicTableNameOrOptions extends
		| keyof (Database['public']['Tables'] & Database['public']['Views'])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
				Database[PublicTableNameOrOptions['schema']]['Views'])
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
			Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
	  }
		? R
		: never
	: PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
			Database['public']['Views'])
	? (Database['public']['Tables'] & Database['public']['Views'])[PublicTableNameOrOptions] extends {
			Row: infer R;
	  }
		? R
		: never
	: never;

export type TablesInsert<
	PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
	  }
		? I
		: never
	: PublicTableNameOrOptions extends keyof Database['public']['Tables']
	? Database['public']['Tables'][PublicTableNameOrOptions] extends {
			Insert: infer I;
	  }
		? I
		: never
	: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
		: never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
	  }
		? U
		: never
	: PublicTableNameOrOptions extends keyof Database['public']['Tables']
	? Database['public']['Tables'][PublicTableNameOrOptions] extends {
			Update: infer U;
	  }
		? U
		: never
	: never;

export type Enums<
	PublicEnumNameOrOptions extends keyof Database['public']['Enums'] | { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
		: never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
	: PublicEnumNameOrOptions extends keyof Database['public']['Enums']
	? Database['public']['Enums'][PublicEnumNameOrOptions]
	: never;
