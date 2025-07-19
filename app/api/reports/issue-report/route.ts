import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { db } from '@/lib/db'

async function handler(request: NextRequest) {
  const bookIssues = await db.bookIssue.findMany({
    where: { status: 'ISSUED' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          studentId: true,
          email: true,
          fine: true
        }
      },
      book: {
        select: {
          id: true,
          title: true,
          author: true,
          isbn: true
        }
      }
    },
    orderBy: { issueDate: 'desc' }
  })

  // Calculate overdue fines
  const currentDate = new Date()
  const enrichedIssues = bookIssues.map(issue => {
    const dueDate = new Date(issue.dueDate)
    const isOverdue = currentDate > dueDate
    const daysOverdue = isOverdue ? Math.ceil((currentDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0
    const overdueFine = daysOverdue * 5

    return {
      ...issue,
      isOverdue,
      daysOverdue,
      overdueFine
    }
  })

  return Response.json({ bookIssues: enrichedIssues })
}

export const GET = withAuth(handler, 'LIBRARIAN')