-- AlterEnum
ALTER TYPE "NotfiyType" ADD VALUE 'NEW_BLOCK_NOTE';

-- CreateTable
CREATE TABLE "BlockNote" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "creatorId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "BlockNote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BlockNote" ADD CONSTRAINT "BlockNote_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockNote" ADD CONSTRAINT "BlockNote_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
