'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login Data:', formData)
    // Replace with your actual login logic
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background dark:bg-neutral-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          Log in to your LibraryMS account
        </p>

        <div className="space-y-2">
          <Label htmlFor="email" className="dark:text-neutral-200">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="dark:text-neutral-200">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            className="dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>

        <Button type="submit" className="w-full bg-white">
          Log In
        </Button>

        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
          Don’t have an account?{' '}
          <Link href="/auth/register" className="text-blue-600 dark:text-blue-400 underline">
            Register
          </Link>
        </p>
      </form>
    </main>
  )
}
