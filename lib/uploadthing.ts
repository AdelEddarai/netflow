import { generateReactHelpers } from '@uploadthing/react/hooks';
import { generateComponents } from '@uploadthing/react';
import type { OurFileRouter } from '@/app/api/uploadthing/core';

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();

export const { UploadButton, UploadDropzone, Uploader } = generateComponents<OurFileRouter>();
