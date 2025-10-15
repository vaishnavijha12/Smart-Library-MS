import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { db } from '@/lib/db'

async function handler(request: NextRequest) {
  const user = (request as unknown as { user?: { userId?: string } }).user
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const bookIssues = await db.bookIssue.findMany({
  where: {
    userId: user.userId,
    status: 'ISSUED'
  },
  include: {
    bookCopy: {
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            isbn: true
          }
        }
      }
    }
  },
  orderBy: { issueDate: 'desc' }
})


  return Response.json({ bookIssues })
}

export const GET = withAuth(handler)