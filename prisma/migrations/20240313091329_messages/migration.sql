-- CreateEnum
CREATE TYPE "AditionalRecourceTypes" AS ENUM ('PDF', 'IMAGE');

-- DropIndex
DROP INDEX "MindMap_creatorId_idx";

-- DropIndex
DROP INDEX "MindMap_updatedUserId_idx";

-- DropIndex
DROP INDEX "MindMap_workspaceId_idx";

-- DropIndex
DROP INDEX "Notification_notifayCreatorId_idx";

-- DropIndex
DROP INDEX "Notification_userId_idx";

-- DropIndex
DROP INDEX "Notification_workspaceId_idx";

-- DropIndex
DROP INDEX "PomodoroSettings_userId_idx";

-- DropIndex
DROP INDEX "Subscription_userId_idx";

-- DropIndex
DROP INDEX "Subscription_workspaceId_idx";

-- DropIndex
DROP INDEX "Tag_workspaceId_idx";

-- DropIndex
DROP INDEX "Task_creatorId_idx";

-- DropIndex
DROP INDEX "Task_dateId_idx";

-- DropIndex
DROP INDEX "Task_updatedUserId_idx";

-- DropIndex
DROP INDEX "Task_workspaceId_idx";

-- DropIndex
DROP INDEX "VerificationToken_identifier_token_key";

-- DropIndex
DROP INDEX "Workspace_creatorId_idx";

-- DropIndex
DROP INDEX "assignedToMindMap_mindMapId_idx";

-- DropIndex
DROP INDEX "assignedToMindMap_userId_idx";

-- DropIndex
DROP INDEX "assignedToTask_taskId_idx";

-- DropIndex
DROP INDEX "assignedToTask_userId_idx";

-- DropIndex
DROP INDEX "savedMindMaps_mindMapId_idx";

-- DropIndex
DROP INDEX "savedMindMaps_userId_idx";

-- DropIndex
DROP INDEX "savedTask_taskId_idx";

-- DropIndex
DROP INDEX "savedTask_userId_idx";

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "edited" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aditionalRecource" (
    "id" TEXT NOT NULL,
    "messageId" TEXT,
    "type" "AditionalRecourceTypes" NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "aditionalRecource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_workspaceId_key" ON "Conversation"("workspaceId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aditionalRecource" ADD CONSTRAINT "aditionalRecource_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
