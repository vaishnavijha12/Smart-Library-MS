import { NextRequest } from 'next/server'
import { withAuth } from '@/lib/middleware'
import { db } from '@/lib/db'

async function deleteHandler(request: NextRequest, context: unknown) {
  const { params } = context as { params: { id: string } }
  try {
    await db.user.delete({ where: { id: params.id } })
    return Response.json({ message: 'User deleted successfully' })
  } catch (err) {
    console.error('Delete user error:', err)
    return Response.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}

async function putHandler(request: NextRequest, context: unknown) {
  const { params } = context as { params: { id: string } }
  const user = (request as unknown as { user?: { userId?: string; role?: string } }).user
  const { name, phone, address } = await request.json()

  // Ensure user is present
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Users can only update their own profile, librarians can update any profile
  if (user.role !== 'LIBRARIAN' && user.userId !== params.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const updatedUser = await db.user.update({
      where: { id: params.id },
      data: { name, phone, address },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        studentId: true,
        fine: true,
      },
    })

    return Response.json({ user: updatedUser })
  } catch (err) {
    console.error('Update user error:', err)
    return Response.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export const DELETE = withAuth(deleteHandler, 'LIBRARIAN')
export const PUT = withAuth(putHandler)