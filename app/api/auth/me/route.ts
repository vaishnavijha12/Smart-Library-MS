import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { db } from '@/lib/db'

async function handler(request: NextRequest) {
  const user = (request as any).user

  const userData = await db.user.findUnique({
    where: { id: user.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      studentId: true,
      phone: true,
      address: true,
      fine: true
    }
  })

  return Response.json({ user: userData })
}

export const GET = withAuth(handler)