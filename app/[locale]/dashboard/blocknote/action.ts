// app/actions.ts
'use server'

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { BlockNote } from "@prisma/client"

export async function saveBlockNote(title: string, content: any) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const blockNote = await prisma.blockNote.create({
      data: {
        title,
        content,
        userId: session.user.id,
      },
    })
    return { success: true, id: blockNote.id }
  } catch (error) {
    console.error('Error saving BlockNote:', error)
    return { success: false, error: String(error) }
  }
}

export async function getUserBlockNotes(): Promise<{ success: boolean; blockNotes?: BlockNote[]; error?: string }> {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const blockNotes = await prisma.blockNote.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return { success: true, blockNotes }
  } catch (error) {
    console.error('Error fetching BlockNotes:', error)
    return { success: false, error: String(error) }
  }
}

export async function getBlockNoteById(id: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const blockNote = await prisma.blockNote.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
    })

    if (!blockNote) {
      return { success: false, error: 'BlockNote not found' }
    }

    return { success: true, blockNote }
  } catch (error) {
    console.error('Error fetching BlockNote:', error)
    return { success: false, error: String(error) }
  }
}

export async function updateBlockNote(id: string, title: string, content: any): Promise<{ success: boolean; blockNote?: BlockNote; error?: string }> {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return { success: false, error: 'User not authenticated' }
    }

    const updatedBlockNote = await prisma.blockNote.update({
      where: {
        id: id,
        userId: session.user.id,
      },
      data: {
        title,
        content,
      },
    })

    return { success: true, blockNote: updatedBlockNote }
  } catch (error) {
    console.error('Error updating BlockNote:', error)
    return { success: false, error: String(error) }
  }
}