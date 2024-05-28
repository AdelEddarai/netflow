import { getToken } from 'next-auth/jwt';
import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
	imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
		.middleware(async (req) => {
			const user = await getToken(req);
			if (!user) throw new Error('Unauthorized');
			return { userId: user.id };
		})
		.onUploadComplete(async () => {}),

	addToChatFile: f({
		pdf: { maxFileSize: '32MB', maxFileCount: 5 },
		image: { maxFileSize: '16MB', maxFileCount: 5 },
	})
		.middleware(async (req) => {
			const user = await getToken(req);
			if (!user) throw new Error('Unauthorized');
			return { userId: user.id };
		})
		.onUploadComplete(async () => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
