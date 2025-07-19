import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { db } from '@/lib/db'

async function handler(request: NextRequest) {
  const { bookId } = await request.json()

  if (!bookId) {
    return Response.json({ error: 'Book ID is required' }, { status: 400 })
  }

  try {
    // Find the book issue record
    const bookIssue = await db.bookIssue.findFirst({
      where: {
        bookId,
        status: 'ISSUED'
      },
      include: {
        user: { select: { name: true, studentId: true } },
        book: { select: { title: true, author: true } }
      }
    })

    if (!bookIssue) {
      return Response.json({ error: 'No issued record found for this book' }, { status: 404 })
    }

    // Calculate fine if overdue
    const currentDate = new Date()
    const dueDate = new Date(bookIssue.dueDate)
    let fine = 0

    if (currentDate > dueDate) {
      const daysOverdue = Math.ceil((currentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
      fine = daysOverdue * 5 // $5 per day
    }

    // Update book issue record
    const updatedBookIssue = await db.bookIssue.update({
      where: { id: bookIssue.id },
      data: {
        status: 'RETURNED',
        returnDate: currentDate,
        fine
      },
      include: {
        user: { select: { name: true, studentId: true } },
        book: { select: { title: true, author: true } }
      }
    })

    // Update user's total fine
    if (fine > 0) {
      await db.user.update({
        where: { id: bookIssue.userId },
        data: { fine: { increment: fine } }
      })
    }

    // Update book availability
    await db.book.update({
      where: { id: bookId },
      data: { available: { increment: 1 } }
    })

    return Response.json({ 
      message: 'Book returned successfully',
      bookIssue: updatedBookIssue,
      fine
    })
  } catch (error) {
    console.error('Return book error:', error)
    return Response.json({ error: 'Failed to return book' }, { status: 500 })
  }
}

export const POST = withAuth(handler, 'LIBRARIAN')