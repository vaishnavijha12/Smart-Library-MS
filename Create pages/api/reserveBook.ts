import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const session = await getSession({ req })
  if (!session || !session.user?.email) {
    return res.status(401).json({ message: 'You must be logged in to reserve a book' })
  }

  const userEmail = session.user.email
  const { bookId } = req.body

  if (!bookId) {
    return res.status(400).json({ message: 'Book ID is required' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: userEmail } })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const existing = await prisma.reservation.findFirst({
      where: { bookId, userId: user.id, status: 'active' },
    })

    if (existing) {
      return res.status(400).json({ message: 'You have already reserved this book' })
    }

    await prisma.reservation.create({
      data: {
        bookId,
        userId: user.id,
        status: 'active',
      },
    })

    return res.status(200).json({ message: 'Book reserved successfully!' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Something went wrong' })
  }
}
