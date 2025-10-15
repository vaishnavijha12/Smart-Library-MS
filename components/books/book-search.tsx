'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Book} from 'lucide-react'

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  description?: string
  available: number
  quantity: number
}

export function BookSearch() {
  const [books, setBooks] = useState<Book[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/books?search=${search}`)
      if (response.ok) {
        const data = await response.json()
        setBooks(data.books)
      }
    } catch (error) {
      console.error('Failed to fetch books:', error)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search books by title, author, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <Card key={book.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{book.title}</CardTitle>
              <CardDescription>by {book.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Book className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">ISBN: {book.isbn}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{book.category}</Badge>
                  <Badge variant={book.available > 0 ? 'default' : 'destructive'}>
                    {book.available}/{book.quantity} Available
                  </Badge>
                </div>
                {book.description && (
                  <p className="text-sm text-gray-600 mt-2">{book.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {books.length === 0 && !loading && (
        <div className="text-center py-8">
          <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No books found</p>
        </div>
      )}
    </div>
  )
}