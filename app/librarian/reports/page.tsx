'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Book, User, Clock, IndianRupee, AlertCircle } from 'lucide-react'

interface BookIssue {
  id: string
  issueDate: string
  dueDate: string
  fine: number
  isOverdue: boolean
  daysOverdue: number
  overdueFine: number
  user: {
    id: string
    name: string
    studentId: string
    email: string
    fine: number
  }
  bookCopy: {
    id: string
    book: {
      id: string
      title: string
      author: string
      isbn: string
    }
  }
}

export default function IssueReports() {
  const [bookIssues, setBookIssues] = useState<BookIssue[]>([])

  useEffect(() => {
    fetchIssueReport()
  }, [])

  const fetchIssueReport = async () => {
    try {
      const response = await fetch('/api/reports/issue-report')
      if (response.ok) {
        const data = await response.json()
        setBookIssues(data.bookIssues)
      }
    } catch (error) {
      console.error('Failed to fetch issue report:', error)
    }
  }

  const totalFines = bookIssues.reduce((sum, issue) => sum + issue.overdueFine, 0)
  const overdueBooks = bookIssues.filter(issue => issue.isOverdue).length
  const activeUsers = new Set(bookIssues.map(issue => issue.user.id)).size

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-zinc-800 mb-2">Book Issue Reports</h1>
          <p className="text-gray-600">Live snapshot of all issued books & member dues.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { title: 'Total Issued', value: bookIssues.length, icon: <Book className="h-5 w-5" /> },
            { title: 'Overdue Books', value: overdueBooks, icon: <Clock className="h-5 w-5" /> },
            { title: 'Pending Fines', value: `₹${totalFines.toFixed(2)}`, icon: <IndianRupee className="h-5 w-5" /> },
            { title: 'Active Users', value: activeUsers, icon: <User className="h-5 w-5" /> },
          ].map(({ title, value, icon }) => (
            <Card
              key={title}
              className="shadow-sm hover:shadow-md transition rounded-lg border border-zinc-200 bg-white"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">{title}</CardTitle>
                <div className="text-zinc-500">{icon}</div>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${title.includes('Overdue') ? 'text-red-600' : 'text-zinc-800'}`}>
                  {value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Details */}
        <Card className="shadow-sm border border-zinc-200 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-zinc-800">Issued Books Details</CardTitle>
            <CardDescription className="text-gray-600">
              Detailed list of books, borrowers, and due status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bookIssues.length > 0 ? (
              <div className="space-y-4">
                {bookIssues.map((issue) => {
                  const dueDate = new Date(issue.dueDate)
                  const issuedDate = new Date(issue.issueDate)
                  const book = issue.bookCopy.book

                  return (
                    <div
                      key={issue.id}
                      className={`p-4 border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
                        issue.isOverdue ? 'border-red-300 bg-red-50' : 'border-zinc-200 bg-white'
                      }`}
                    >
                      {/* Book Info */}
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-zinc-800">{book.title}</h4>
                        <p className="text-sm text-gray-700">by {book.author}</p>
                        <p className="text-xs text-gray-500">ISBN: {book.isbn} | Copy ID: {issue.bookCopy.id}</p>
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{issue.user.name}</span>
                        </div>
                        <p className="text-sm text-gray-600">ID: {issue.user.studentId}</p>
                        <p className="text-sm text-gray-600">{issue.user.email}</p>
                        <Badge variant={issue.user.fine > 0 ? 'destructive' : 'default'} className="mt-2">
                          Total Fine: ₹{issue.user.fine.toFixed(2)}
                        </Badge>
                      </div>

                      {/* Dates & Status */}
                      <div className="flex-1">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Issued:</span> {issuedDate.toLocaleDateString()}
                          </p>
                          <p className={`text-sm ${issue.isOverdue ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
                            <span className="font-medium">Due:</span> {dueDate.toLocaleDateString()}
                          </p>
                          {issue.isOverdue && (
                            <div className="mt-1 flex items-center gap-2">
                              <Badge variant="destructive">{issue.daysOverdue} days overdue</Badge>
                              <AlertCircle className="h-4 w-4 text-red-500" />
                              <span className="text-sm text-red-600 font-medium">+₹{issue.overdueFine.toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No books currently issued.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
