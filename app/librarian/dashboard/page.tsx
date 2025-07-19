'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QRScanner } from '@/components/librarian/qr-scanner'
import { toast } from 'sonner'
import { Book, Users, QrCode, Plus, ArrowLeftRight } from 'lucide-react'
import { parseQRData } from '@/lib/qr-utils'
import { useRouter } from 'next/navigation'

export default function LibrarianDashboard() {
    const router = useRouter()
  const [issueForm, setIssueForm] = useState({ studentId: '', bookId: '' })
  const [returnForm, setReturnForm] = useState({ bookId: '' })
  const [scanMode, setScanMode] = useState<'none' | 'issue' | 'return'>('none')
  const [quickIssueStep, setQuickIssueStep] = useState<'user' | 'book' | 'none'>('none')
  const [quickIssueData, setQuickIssueData] = useState({ userId: '', bookId: '' })

  const handleManualIssue = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/books/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueForm)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Book issued successfully!')
        setIssueForm({ studentId: '', bookId: '' })
      } else {
        toast.error(data.error || 'Failed to issue book')
      }
    } catch (error) {
      toast.error('An error occurred while issuing book')
    }
  }

  const handleManualReturn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/books/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(returnForm)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Book returned successfully! ${data.fine > 0 ? `Fine: $${data.fine}` : ''}`)
        setReturnForm({ bookId: '' })
      } else {
        toast.error(data.error || 'Failed to return book')
      }
    } catch (error) {
      toast.error('An error occurred while returning book')
    }
  }

  const handleQRScan = (data: string) => {
    const parsed = parseQRData(data)
    
    if (!parsed) {
      toast.error('Invalid QR code format')
      return
    }

    if (scanMode === 'issue') {
      if (quickIssueStep === 'user' && parsed.type === 'user') {
        setQuickIssueData({ ...quickIssueData, userId: parsed.id })
        setQuickIssueStep('book')
        toast.success('User scanned, now scan book QR code')
      } else if (quickIssueStep === 'book' && parsed.type === 'book') {
        setQuickIssueData({ ...quickIssueData, bookId: parsed.id })
        performQuickIssue(quickIssueData.userId, parsed.id)
      } else {
        toast.error('Please scan the correct QR code type')
      }
    } else if (scanMode === 'return' && parsed.type === 'book') {
      performQuickReturn(parsed.id)
    }
  }

  const performQuickIssue = async (userId: string, bookId: string) => {
    try {
      // First get user's student ID
      const userResponse = await fetch(`/api/users`)
      const userData = await userResponse.json()
      const user = userData.users.find((u: any) => u.id === userId)
      
      if (!user) {
        toast.error('User not found')
        return
      }

      const response = await fetch('/api/books/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user.studentId, bookId })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Book issued successfully via QR!')
        resetQuickIssue()
      } else {
        toast.error(data.error || 'Failed to issue book')
      }
    } catch (error) {
      toast.error('An error occurred during quick issue')
    }
  }

  const performQuickReturn = async (bookId: string) => {
    try {
      const response = await fetch('/api/books/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Book returned successfully via QR! ${data.fine > 0 ? `Fine: $${data.fine}` : ''}`)
        setScanMode('none')
      } else {
        toast.error(data.error || 'Failed to return book')
      }
    } catch (error) {
      toast.error('An error occurred during quick return')
    }
  }

  const resetQuickIssue = () => {
    setScanMode('none')
    setQuickIssueStep('none')
    setQuickIssueData({ userId: '', bookId: '' })
  }

  const startQuickIssue = () => {
    setScanMode('issue')
    setQuickIssueStep('user')
    setQuickIssueData({ userId: '', bookId: '' })
  }

  const startQuickReturn = () => {
    setScanMode('return')
    setQuickIssueStep('none')
  }

  return (
    <div className="min-h-screen bg-gray-50">      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Librarian Dashboard</h1>
          <p className="text-gray-600">Manage book issues, returns, and library operations</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Button onClick={() => router.push('/librarian/books')} className="h-18 flex flex-col bg-zinc-800 text-white">
            <Book className="h-6 w-6 mb-1" />
            Manage Books
          </Button>
          <Button onClick={() => router.push('/librarian/members')} className="h-18 flex flex-col bg-zinc-800 text-white">
            <Users className="h-6 w-6 mb-1" />
            Library Members
          </Button>
          <Button onClick={() => router.push('/librarian/reports')} className="h-18 flex flex-col bg-zinc-800 text-white">
            <ArrowLeftRight className="h-6 w-6 mb-1" />
            Issue Reports
          </Button>
          <Button onClick={() => router.push('/librarian/qr-generator')} className="h-18 flex flex-col bg-zinc-800 text-white">
            <QrCode className="h-6 w-6 mb-1" />
            QR Generator
          </Button>
        </div>

        <Tabs defaultValue="qr" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="qr">QR Code Operations</TabsTrigger>
            <TabsTrigger value="manual">Manual Operations</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-6 bg-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Manual Issue */}
              <Card>
                <CardHeader>
                  <CardTitle>Issue Book</CardTitle>
                  <CardDescription>Issue a book to a student manually</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleManualIssue} className="space-y-4">
                    <div>
                      <Label className="mb-2" htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        value={issueForm.studentId}
                        onChange={(e) => setIssueForm({ ...issueForm, studentId: e.target.value })}
                        placeholder="Enter student ID"
                        required
                      />
                    </div>
                    <div>
                      <Label className="mb-2" htmlFor="bookId">Book ID</Label>
                      <Input
                        id="bookId"
                        value={issueForm.bookId}
                        onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
                        placeholder="Enter book ID"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-zinc-800 text-white">
                      Issue Book
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Manual Return */}
              <Card>
                <CardHeader>
                  <CardTitle>Return Book</CardTitle>
                  <CardDescription>Process book return manually</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleManualReturn} className="space-y-4">
                    <div>
                      <Label className="mb-2" htmlFor="returnBookId">Book ID</Label>
                      <Input
                        id="returnBookId"
                        value={returnForm.bookId}
                        onChange={(e) => setReturnForm({ bookId: e.target.value })}
                        placeholder="Enter book ID"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-zinc-800 text-white">
                      Return Book
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="qr" className="space-y-6 bg-gray-100">
            {scanMode === 'none' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Issue</CardTitle>
                    <CardDescription>Issue books using QR code scanner</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={startQuickIssue} className="w-full bg-zinc-800 text-white">
                      <QrCode className="h-4 w-4 mr-2" />
                      Start Quick Issue
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">
                      First scan user QR, then scan book QR
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Return</CardTitle>
                    <CardDescription>Return books using QR code scanner</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={startQuickReturn} className="w-full bg-zinc-800 text-white">
                      <QrCode className="h-4 w-4 mr-2" />
                      Start Quick Return
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">
                      Scan book QR code to return
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="space-y-4">
                  <QRScanner
                    onScan={handleQRScan}
                    title={
                      scanMode === 'issue'
                        ? quickIssueStep === 'user'
                          ? 'Scan User QR Code'
                          : 'Scan Book QR Code'
                        : 'Scan Book QR Code to Return'
                    }
                  />
                  <Button 
                    onClick={() => {
                      setScanMode('none')
                      resetQuickIssue()
                    }} 
                    variant="outline" 
                    className="w-full text-white bg-zinc-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}