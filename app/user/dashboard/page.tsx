'use client'

import { BookSearch } from '@/components/books/book-search'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Book, Clock, IndianRupee } from 'lucide-react'
import { useState, useEffect } from 'react'

interface BookIssue {
  id: string
  issueDate: string
  dueDate: string
  fine: number
  bookCopy: {
    book: {
      id: string
      title: string
      author: string
      isbn: string
    }
  }
}

export default function UserDashboard() {
  const [bookIssues, setBookIssues] = useState<BookIssue[]>([])
  const [user, setUser] = useState<{ fine: number } | null>(null)

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-zinc-800 mb-2">
            Student Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back! Here&apos;s your updated library summary.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Books Issued
              </CardTitle>
              <Book className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-zinc-800">
                {bookIssues.length}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Overdue Books
              </CardTitle>
              <Clock className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-zinc-800">
                {
                  bookIssues.filter(
                    (issue) => new Date(issue.dueDate) < new Date()
                  ).length
                }
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Total Fine
              </CardTitle>
              <IndianRupee className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-zinc-800">
                ₹{user?.fine || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Currently Issued Books */}
        <Card className="shadow-md mb-12">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-zinc-800">
              Currently Issued Books
            </CardTitle>
            <CardDescription className="text-gray-600">
              Books you have currently borrowed from the library.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bookIssues.length > 0 ? (
              <div className="space-y-4">
                {bookIssues.map((issue) => {
                  const dueDate = new Date(issue.dueDate)
                  const isOverdue = dueDate < new Date()
                  const book = issue.bookCopy.book

                  return (
                    <div
                      key={issue.id}
                      className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border transition-all ${
                        isOverdue
                          ? 'border-red-400 bg-red-50'
                          : 'border-zinc-200 bg-white'
                      }`}
                    >
                      <div className="mb-2 md:mb-0">
                        <h4 className="font-semibold text-zinc-800">
                          {book.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          by {book.author}
                        </p>
                        <p className="text-xs text-gray-500">
                          ISBN: {book.isbn}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-medium ${
                            isOverdue ? 'text-red-600' : 'text-gray-700'
                          }`}
                        >
                          Due: {dueDate.toLocaleDateString()}
                        </p>
                        {isOverdue && (
                          <p className="text-xs font-semibold text-red-600">
                            Overdue!
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-gray-500">
                You currently have no books issued.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Book Search */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-zinc-800">
              Library Books
            </CardTitle>
            <CardDescription className="text-gray-600">
              Search and explore all available books.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BookSearch />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
