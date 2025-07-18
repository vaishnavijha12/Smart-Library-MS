'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"

import { useRouter } from 'next/navigation'

export default function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
  })

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      console.log(res)
      if (!res.ok) {
        throw new Error('Failed to register');
      }

      const data = await res.json();
      if(data.user.role === "USER"){
        router.push('/user/dashboard')
      }
      else{
        router.push('/librarian/dashboard')
      }
      

    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background dark:bg-neutral-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Create your account
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          Join LibraryMS to manage your books smartly.
        </p>

        <div className="space-y-2">
          <Label htmlFor="name" className="dark:text-neutral-200">Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="role" className="dark:text-neutral-200">Role</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => setFormData({ ...formData, role: value })}
          >
            <SelectTrigger className="dark:bg-neutral-800 dark:text-neutral-100">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent className="dark:bg-neutral-800 dark:text-neutral-100">
              <SelectItem value="USER">Student</SelectItem>
              <SelectItem value="LIBRARIAN">Librarian</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          className="w-full bg-white"
        >
          Create Account
        </Button>

        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
          Already have an account? 
          <Link href="/auth/login" className="text-blue-600 dark:text-blue-400 underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  )
}
