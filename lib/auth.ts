import { NextAuthOptions, getServerSession } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { Adapter } from 'next-auth/adapters';
import { db } from './db';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { generateFromEmail } from 'unique-username-generator';

import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
	session: {
		strategy: 'jwt',
	},
	pages: {
		error: '/sign-in',
		signIn: '/sign-in',
	},
	adapter: PrismaAdapter(db) as Adapter,
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			async profile(profile) {
				const username = generateFromEmail(profile.email, 5);
				return {
					id: profile.sub,
					username,
					name: profile.given_name ? profile.given_name : profile.name,
					surname: profile.family_name ? profile.family_name : '',
					email: profile.email,
					image: profile.picture,
				};
			},
		}),
		GithubProvider({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,

			async profile(profile) {
				const username = generateFromEmail(profile.email, 5);
				const fullName = profile.name.split(' ');
				return {
					id: profile.id,
					username: profile.login ? profile.login : username,
					name: fullName.at(0),
					surname: fullName.at(1),
					email: profile.email,
					image: profile.avatar_url,
				};
			},
		}),
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				username: { label: 'Username', type: 'text', placeholder: 'Username' },
				email: { label: 'Email', type: 'text', placeholder: 'Password' },
				password: { label: 'Password', type: 'password', placeholder: 'Password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) throw new Error('ERRORS.WRONG_DATA');

				const user = await db.user.findUnique({
					where: {
						email: credentials.email,
					},
				});

				if (!user || !user?.hashedPassword) throw new Error('ERRORS.NO_USER');

				const passwordMatch = await bcrypt.compare(credentials.password, user.hashedPassword);

				if (!passwordMatch) throw new Error('ERRORS.WRONG_PASSWORD');

				return user;
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.surname = token.surname;
				session.user.email = token.email;
				session.user.image = token?.picture;
				session.user.username = token.username;
				session.user.completedOnboarding = !!token.completedOnboarding;
			}

			const user = await db.user.findUnique({
				where: {
					id: token.id,
				},
			});
			if (user) {
				session.user.image = user.image;
				session.user.completedOnboarding = user.completedOnboarding;
				session.user.username = user.username;
				session.user.name = user.name;
				session.user.surname = user.surname;
			}

			return session;
		},
		async jwt({ token, user }) {
			const dbUser = await db.user.findFirst({
				where: {
					email: token.email,
				},
			});

			if (!dbUser) {
				token.id = user!.id;
				return token;
			}

			return {
				id: dbUser.id,
				name: dbUser.name,
				surname: dbUser.surname,
				username: dbUser.username,
				email: dbUser.email,
				picture: dbUser.image,
				completedOnboarding: dbUser.completedOnboarding,
			};
		},
	},
};

export const getAuthSession = () => getServerSession(authOptions);
