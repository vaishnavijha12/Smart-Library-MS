import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromRequest } from './auth'

export function withAuth(handler: Function, requiredRole?: string) {
  return async (request: NextRequest, context?: any) => {
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

    // Add user to request context
    (request as any).user = payload
    
    return handler(request, context)
  }
}