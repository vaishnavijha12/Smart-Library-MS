import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromRequest, JWTPayload } from './auth'

type RouteHandler<C = unknown> = (
  request: NextRequest & { user?: JWTPayload },
  context: C
) => Promise<Response> | Response

export function withAuth<C = unknown>(handler: RouteHandler<C>, requiredRole?: string): RouteHandler<C> {
  const wrapped = async (request: NextRequest, context: C) => {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    if (requiredRole && payload.role !== requiredRole) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Attach user payload to the request using a safe cast
    const reqWithUser = request as NextRequest & { user?: JWTPayload }
    reqWithUser.user = payload

    return handler(reqWithUser as unknown as Parameters<typeof handler>[0], context)
  }

  return wrapped
}