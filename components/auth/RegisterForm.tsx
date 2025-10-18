'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'

export default function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' })
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        cache: 'no-store',
      })

      if (!res.ok) throw new Error('Failed to register')

      const data = await res.json()
      startTransition(() => {
        router.push(data.user.role === 'USER' ? '/user/dashboard' : '/librarian/dashboard')
      })
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white border border-neutral-200 rounded-2xl p-12 shadow-xl space-y-8"
      >
        <div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">
            Create your account
          </h2>
          <p className="text-sm text-neutral-600">
            Join LibraryMS to manage your books smartly.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-white text-neutral-900 placeholder:text-neutral-400 border-neutral-300 h-12"
            autoComplete="name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-white text-neutral-900 placeholder:text-neutral-400 border-neutral-300 h-12"
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            className="bg-white text-neutral-900 placeholder:text-neutral-400 border-neutral-300 h-12"
            autoComplete="new-password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
          >
            <SelectTrigger className="bg-white text-neutral-900 border-neutral-300 h-12">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent className="bg-white text-neutral-900">
              <SelectItem value="USER">Student</SelectItem>
              <SelectItem value="LIBRARIAN">Librarian</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all"
          disabled={isPending}
        >
          {isPending ? 'Creating Account…' : 'Create Account'}
        </Button>

        <p className="text-center text-sm text-neutral-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  )
}
