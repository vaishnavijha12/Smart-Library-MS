import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { db } from '@/lib/db'

async function getHandler(request: NextRequest) {

  const books = await db.bookCopy.findMany({})
  return Response.json({ books })
}

export const GET = withAuth(getHandler)