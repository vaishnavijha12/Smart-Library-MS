import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { db } from '@/lib/db'
// Local minimal types to avoid implicit any
type BookBase = {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  description: string | null
}

async function handler(request: NextRequest) {
  const user = (request as unknown as { user?: { userId?: string } }).user
  if (!user?.userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 1) Find recent books the user interacted with (issued or returned)
  const recentIssues = await db.bookIssue.findMany({
    where: { userId: user.userId },
    include: {
      bookCopy: { include: { book: true } },
    },
    orderBy: { issueDate: 'desc' },
    take: 15,
  })

  type IssueWithRelations = { bookCopy: { book: BookBase } }
  const recentBooks = (recentIssues as IssueWithRelations[])
    .map((issue: IssueWithRelations) => issue.bookCopy.book)
    .filter((b: BookBase | null | undefined): b is BookBase => Boolean(b))

  const authors = Array.from(new Set(recentBooks.map((b) => b.author)))
  const categories = Array.from(new Set(recentBooks.map((b) => b.category)))
  const seenBookIds = new Set(recentBooks.map((b) => b.id))

  // Exclude books currently issued to this user
  const currentlyIssuedCopies = await db.bookIssue.findMany({
    where: { userId: user.userId, status: 'ISSUED' },
    include: { bookCopy: true },
  })
  type IssueWithCopy = { bookCopy: { bookId: string } }
  const currentlyIssuedBookIds = new Set(
    (currentlyIssuedCopies as IssueWithCopy[]).map((bi: IssueWithCopy) => bi.bookCopy.bookId)
  )

  // 2) Recommend by same author
  type BookWithCopies = BookBase & { copies: { status: 'AVAILABLE' | 'ISSUED' }[] }
  const byAuthor = await db.book.findMany({
    where: {
      author: { in: authors },
      NOT: { id: { in: Array.from(new Set([...seenBookIds, ...currentlyIssuedBookIds])) } },
    },
    include: { copies: true },
    take: 20,
  }) as unknown as BookWithCopies[]

  // 3) Recommend by same category
  const byCategory = await db.book.findMany({
    where: {
      category: { in: categories },
      NOT: { id: { in: Array.from(new Set([...seenBookIds, ...currentlyIssuedBookIds])) } },
    },
    include: { copies: true },
    take: 20,
  }) as unknown as BookWithCopies[]

  // 4) Shape with reasons and availability
  function toCard(b: BookWithCopies, reason: string) {
    const available = b.copies.filter((c: { status: 'AVAILABLE' | 'ISSUED' }) => c.status === 'AVAILABLE').length
    const total = b.copies.length
    return {
      id: b.id,
      title: b.title,
      author: b.author,
      isbn: b.isbn,
      category: b.category,
      description: b.description,
      available,
      quantity: total,
      reason,
    }
  }

  // Flatten with explicit per-item reasons referencing a source book
  const merged = new Map<string, ReturnType<typeof toCard>>()

  // Helper to find a representative source book for a candidate
  const findSourceForAuthor = (candidateAuthor: string) =>
    recentBooks.find((src: BookBase) => src.author === candidateAuthor)
  const findSourceForCategory = (candidateCategory: string) =>
    recentBooks.find((src: BookBase) => src.category === candidateCategory)

  // Prefer author-based matches first
  for (const b of byAuthor as BookWithCopies[]) {
    if (merged.has(b.id)) continue
    const src = findSourceForAuthor(b.author)
    const reason = src
      ? `Because you borrowed ${src.title}, more by the same author.`
      : `More by the same author.`
    merged.set(b.id, toCard(b, reason))
  }

  // Then category-based matches, but do not overwrite existing
  for (const b of byCategory as BookWithCopies[]) {
    if (merged.has(b.id)) continue
    const src = findSourceForCategory(b.category)
    const reason = src
      ? `Because you borrowed ${src.title}, more in ${src.category}.`
      : `More in this category.`
    merged.set(b.id, toCard(b, reason))
  }

  const recommendations = Array.from(merged.values()).slice(0, 6)

  return Response.json({ recommendations })
}

export const GET = withAuth(handler)


