import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { db } from '@/lib/db'
import type { JWTPayload } from '@/lib/auth'

async function handler(request: NextRequest & { user?: JWTPayload }) {
  const user = request.user
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
        fine: true,
        profilePic: true,
    },
  })

  return Response.json({ user: userData })
}

export const GET = withAuth(handler)