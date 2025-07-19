import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { db } from '@/lib/db'

async function handler(request: NextRequest) {
  const { studentId, bookId } = await request.json()

  if (!studentId || !bookId) {
    return Response.json({ error: 'Student ID and Book ID are required' }, { status: 400 })
  }

  try {
    // Find user by student ID
    const user = await db.user.findFirst({
      where: { studentId }
    })

    if (!user) {
      return Response.json({ error: 'Student not found' }, { status: 404 })
    }

    // Find book
    const book = await db.book.findUnique({
      where: { id: bookId }
    })

    if (!book) {
      return Response.json({ error: 'Book not found' }, { status: 404 })
    }

    if (book.available <= 0) {
      return Response.json({ error: 'Book not available' }, { status: 400 })
    }

    // Check if user already has this book issued
    const existingIssue = await db.bookIssue.findFirst({
      where: {
        userId: user.id,
        bookId,
        status: 'ISSUED'
      }
    })

    if (existingIssue) {
      return Response.json({ error: 'Book already issued to this student' }, { status: 400 })
    }

    // Create book issue record
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14) // 14 days from now

    const bookIssue = await db.bookIssue.create({
      data: {
        userId: user.id,
        bookId,
        dueDate,
        status: 'ISSUED'
      },
      include: {
        user: { select: { name: true, studentId: true } },
        book: { select: { title: true, author: true } }
      }
    })

    // Update book availability
    await db.book.update({
      where: { id: bookId },
      data: { available: { decrement: 1 } }
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