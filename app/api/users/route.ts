import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { db } from '@/lib/db'

async function getHandler(request: NextRequest) {
  const users = await db.user.findMany({
    where: { role: 'USER' },
    select: {
      id: true,
      name: true,
      email: true,
      studentId: true,
      phone: true,
      fine: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return Response.json({ users })
}

export const GET = withAuth(getHandler, 'LIBRARIAN')