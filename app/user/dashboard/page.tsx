'use client'

import { BookSearch } from '@/components/books/book-search'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Book, Clock, IndianRupee } from 'lucide-react'
import { useState, useEffect } from 'react'

interface BookIssue {
  id: string
  issueDate: string
  dueDate: string
  fine: number
  book: {
    id: string
    title: string
    author: string
    isbn: string
  }
}

export default function UserDashboard() {
  const [bookIssues, setBookIssues] = useState<BookIssue[]>([])
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    fetchMyBooks()
    fetchUser()
  }, [])

  const fetchMyBooks = async () => {
    try {
      const response = await fetch('/api/users/my-books')
      if (response.ok) {
        const data = await response.json()
        setBookIssues(data.bookIssues)
      }
    } catch (error) {
      console.error('Failed to fetch books:', error)
    }
  }

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your library overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Books Issued</CardTitle>
              <Book className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookIssues.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bookIssues.filter(issue => new Date(issue.dueDate) < new Date()).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fine</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{user?.fine || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Currently Issued Books */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Currently Issued Books</CardTitle>
            <CardDescription>Books you have currently borrowed from the library</CardDescription>
          </CardHeader>
          <CardContent>
            {bookIssues.length > 0 ? (
              <div className="space-y-4">
                {bookIssues.map((issue) => {
                  const dueDate = new Date(issue.dueDate)
                  const isOverdue = dueDate < new Date()
                  
                  return (
                    <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{issue.book.title}</h4>
                        <p className="text-sm text-gray-600">by {issue.book.author}</p>
                        <p className="text-xs text-gray-500">ISBN: {issue.book.isbn}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                          Due: {dueDate.toLocaleDateString()}
                        </p>
                        {isOverdue && (
                          <p className="text-xs text-red-600 font-medium">Overdue!</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-gray-500">No books currently issued</p>
            )}
          </CardContent>
        </Card>

        {/* Book Search */}
        <Card>
          <CardHeader>
            <CardTitle>Library Books</CardTitle>
            <CardDescription>Search and browse available books in the library</CardDescription>
          </CardHeader>
          <CardContent>
            <BookSearch />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}