'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Book, User, Clock, IndianRupee } from 'lucide-react'

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
  book: {
    id: string
    title: string
    author: string
    isbn: string
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

  return (
    <div className="min-h-screen bg-gray-50">      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Issue Reports</h1>
          <p className="text-gray-600">View currently issued books and member information</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issued</CardTitle>
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
              <div className="text-2xl font-bold text-red-600">{overdueBooks}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Fines</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalFines.toFixed(2)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(bookIssues.map(issue => issue.user.id)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Issue Details */}
        <Card>
          <CardHeader>
            <CardTitle>Currently Issued Books</CardTitle>
            <CardDescription>Detailed view of all issued books and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {bookIssues.length > 0 ? (
              <div className="space-y-4">
                {bookIssues.map((issue) => (
                  <div key={issue.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Book Info */}
                      <div>
                        <h4 className="font-semibold text-lg">{issue.book.title}</h4>
                        <p className="text-sm text-gray-600">by {issue.book.author}</p>
                        <p className="text-xs text-gray-500">ISBN: {issue.book.isbn}</p>
                        <p className="text-xs text-gray-500">Book ID: {issue.book.id}</p>
                      </div>
                      
                      {/* User Info */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{issue.user.name}</span>
                        </div>
                        <p className="text-sm text-gray-600">ID: {issue.user.studentId}</p>
                        <p className="text-sm text-gray-600">{issue.user.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">Total Fine:</span>
                          <Badge variant={issue.user.fine > 0 ? 'destructive' : 'default'}>
                            ₹{issue.user.fine.toFixed(2)}
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Issue Details */}
                      <div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm text-gray-500">Issued:</span>
                            <p className="text-sm">{new Date(issue.issueDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-500">Due:</span>
                            <p className={`text-sm ${issue.isOverdue ? 'text-red-600 font-medium' : ''}`}>
                              {new Date(issue.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          {issue.isOverdue && (
                            <div>
                              <Badge variant="destructive">
                                {issue.daysOverdue} days overdue
                              </Badge>
                              <p className="text-sm text-red-600 mt-1">
                                Fine: ${issue.overdueFine.toFixed(2)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No books currently issued</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}