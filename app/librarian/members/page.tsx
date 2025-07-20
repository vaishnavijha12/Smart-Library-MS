'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Users, Trash2, Mail, Phone, CreditCard, IdCard } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  studentId: string
  phone?: string
  fine: number
  createdAt: string
}

export default function MembersManagement() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Member deleted successfully!')
        fetchUsers()
      } else {
        toast.error('Failed to delete member')
      }
    } catch (error) {
      toast.error('An error occurred while deleting member')
    }
  }

  const totalFines = users.reduce((sum, user) => sum + user.fine, 0).toFixed(2)
  const membersWithFines = users.filter(user => user.fine > 0).length

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-zinc-800 mb-2">Library Members</h1>
          <p className="text-gray-600">Manage all registered library members efficiently.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="shadow-sm hover:shadow-md border border-zinc-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Total Members</CardTitle>
              <Users className="h-5 w-5 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-800">{users.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md border border-zinc-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Members with Fines</CardTitle>
              <CreditCard className="h-5 w-5 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{membersWithFines}</div>
            </CardContent>
          </Card>

          <Card className="shadow-sm hover:shadow-md border border-zinc-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Total Fines</CardTitle>
              <CreditCard className="h-5 w-5 text-zinc-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">₹{totalFines}</div>
            </CardContent>
          </Card>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <Card
              key={user.id}
              className="hover:shadow-lg transition rounded-lg border border-zinc-200 bg-white"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-zinc-800">{user.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-zinc-600">
                      <IdCard className="h-4 w-4" />
                      {user.studentId}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{user.email}</span>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{user.phone}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Fine:</span>
                  <Badge variant={user.fine > 0 ? 'destructive' : 'default'}>
                    ₹{user.fine.toFixed(2)}
                  </Badge>
                </div>

                <div className="text-xs text-gray-500">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No members found.</p>
          </div>
        )}
      </div>
    </main>
  )
}
