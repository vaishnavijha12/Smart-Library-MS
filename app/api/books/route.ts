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
    include: {
      copies: true
    },
    orderBy: { createdAt: 'desc' }
  })

  // Transform the data to include book copy information
  const booksWithCopies = books.map(book => {
    const availableCopies = book.copies.filter(copy => copy.status === 'AVAILABLE').length
    const totalCopies = book.copies.length
    
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      description: book.description,
      quantity: totalCopies,
      available: availableCopies,
      copies: book.copies.map(copy => ({
        id: copy.id,
        status: copy.status
      }))
    }
  })

  return Response.json({ books: booksWithCopies })
}

async function postHandler(request: NextRequest) {
  const { title, author, isbn, category, description, quantity } = await request.json()

  if (!title || !author || !isbn || !category) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    // 1. Create the book
    const book = await db.book.create({
      data: {
        title,
        author,
        isbn,
        category,
        description,
      },
    })

    // 2. Create the copies
    const numCopies = parseInt(quantity) || 1

    const copiesData = Array.from({ length: numCopies }).map((_, i) => ({
      id: `${isbn}-${i + 1}`,
      bookId: book.id,
    }))

    await db.bookCopy.createMany({
      data: copiesData,
    })

    return Response.json({ book })
  } catch (error: unknown) {
    console.error(error)
    // Narrow Prisma unique constraint error (P2002)
    const e = error as { code?: string }
    if (e?.code === 'P2002') {
      return Response.json({ error: 'Book with this ISBN already exists' }, { status: 400 })
    }
    return Response.json({ error: 'Failed to create book' }, { status: 500 })
  }
}

export const GET = withAuth(getHandler)
export const POST = withAuth(postHandler, 'LIBRARIAN')