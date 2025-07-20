import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { db } from '@/lib/db'

async function handler(request: NextRequest) {
  const { studentId, bookId } = await request.json()

  if (!studentId || !bookId) {
    return Response.json({ error: 'Student ID and Book ID are required' }, { status: 400 })
  }

  try {
    // Find the user by student ID
    const user = await db.user.findFirst({
      where: { id: studentId }
    })

    if (!user) {
      return Response.json({ error: 'Student not found' }, { status: 404 })
    }

    // Find an AVAILABLE BookCopy for this book
    const bookCopy = await db.bookCopy.findFirst({
      where: {
        id: bookId,
      }
    })
    if (!bookCopy) {
      return Response.json({ error: 'No available copies for this book' }, { status: 400 })
    }

    // Check if user already has an active issue for this book
    const existingIssue = await db.bookIssue.findFirst({
      where: {
        userId: user.id,
        bookCopyId: bookId,
        status: 'ISSUED'
      }
    })

    if (existingIssue) {
      return Response.json({ error: 'Book already issued to this student' }, { status: 400 })
    }

    // Create new issue
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)

    const bookIssue = await db.bookIssue.create({
      data: {
        userId: user.id,
        bookCopyId: bookCopy.id,
        dueDate,
        status: 'ISSUED'
      },
      include: {
        user: { select: { name: true, studentId: true } },
        bookCopy: {
          select: {
            id: true,
            status: true,
            book: {
              select: {
                title: true,
                author: true
              }
            }
          }
        }
      }
    })

    // Mark BookCopy as ISSUED
    await db.bookCopy.update({
      where: { id: bookCopy.id },
      data: { status: 'ISSUED' }
    })

    return Response.json({
      message: 'Book issued successfully',
      bookIssue
    })

  } catch (error) {
    console.error('Issue book error:', error)
    return Response.json({ error: 'Failed to issue book' }, { status: 500 })
  }
}

export const POST = withAuth(handler, 'LIBRARIAN')
