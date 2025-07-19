import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { db } from '@/lib/db'

async function getHandler(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''

  const books = await db.book.findMany({
    where: {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  })

  return Response.json({ books })
}

async function postHandler(request: NextRequest) {
  const { title, author, isbn, category, description, quantity } = await request.json()

  if (!title || !author || !isbn || !category) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const book = await db.book.create({
      data: {
        title,
        author,
        isbn,
        category,
        description,
        quantity: parseInt(quantity) || 1,
        available: parseInt(quantity) || 1
      }
    })

    return Response.json({ book })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return Response.json({ error: 'Book with this ISBN already exists' }, { status: 400 })
    }
    return Response.json({ error: 'Failed to create book' }, { status: 500 })
  }
}

export const GET = withAuth(getHandler)
export const POST = withAuth(postHandler, 'LIBRARIAN')