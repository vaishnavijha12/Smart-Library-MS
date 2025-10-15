import { withAuth } from '@/lib/middleware'
import { db } from '@/lib/db'

async function getHandler() {
  const books = await db.bookCopy.findMany({})
  return Response.json({ books })
}

export const GET = withAuth(getHandler)