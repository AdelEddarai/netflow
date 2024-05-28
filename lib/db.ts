import { PrismaClient } from '@prisma/client';
import 'server-only';

declare global {
	// eslint-disable-next-line no-var, no-unused-vars
	var prisma: PrismaClient;
}

let prisma: PrismaClient;
if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient();
} else {
	if (!global.prisma) {
		global.prisma = new PrismaClient();
	}
	prisma = global.prisma;
}

export const db = prisma;
