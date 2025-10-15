import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, signToken, generateStudentId } from '@/lib/auth'
import type { Role } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role = 'USER' } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Generate student ID for regular users
    const studentId = role === 'USER' ? generateStudentId() : null

    // Normalize role and create user
    const normalizedRole = role === 'LIBRARIAN' ? 'LIBRARIAN' : 'USER'

    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: normalizedRole as Role,
        studentId
      }
    })

    // Generate JWT token
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    // Create response with cookie
    const response = NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        studentId: user.studentId
      }
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}