'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Plus, Search, Trash2, Book } from 'lucide-react'

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  description?: string
  quantity: number
  available: number
}

export default function BooksManagement() {
  const [books, setBooks] = useState<Book[]>([])
  const [search, setSearch] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    description: '',
    quantity: 1,
  })

  useEffect(() => {
    fetchBooks()
  }, [search])

  const fetchBooks = async () => {
    try {
      const response = await fetch(`/api/books?search=${search}`)
      if (response.ok) {
        const data = await response.json()
        setBooks(data.books)
      }
    } catch (error) {
      console.error('Failed to fetch books:', error)
    }
  }

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookForm),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Book added successfully!')
        setShowAddDialog(false)
        setBookForm({
          title: '',
          author: '',
          isbn: '',
          category: '',
          description: '',
          quantity: 1,
        })
        fetchBooks()
      } else {
        toast.error(data.error || 'Failed to add book')
      }
    } catch (error) {
      toast.error('An error occurred while adding book')
    }
  }

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return

    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Book deleted successfully!')
        fetchBooks()
      } else {
        toast.error('Failed to delete book')
      }
    } catch (error) {
      toast.error('An error occurred while deleting book')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-zinc-800 mb-1">Books Management</h1>
            <p className="text-gray-600">Add, search, and manage your library collection</p>
          </div>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-zinc-800 text-white hover:bg-zinc-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white border border-gray-200 shadow-xl rounded-lg p-8">
              <DialogHeader>
                <DialogTitle className="text-lg font-semibold">Add New Book</DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  Enter book details below to add it to the library
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddBook} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={bookForm.title}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={bookForm.author}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, author: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={bookForm.isbn}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, isbn: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={bookForm.category}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, category: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={bookForm.description}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={bookForm.quantity}
                    onChange={(e) =>
                      setBookForm({
                        ...bookForm,
                        quantity: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-zinc-800 text-white hover:bg-zinc-700"
                >
                  Add Book
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search books..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 focus:ring-2 focus:ring-zinc-800"
            />
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Card
              key={book.id}
              className="border border-zinc-200 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-zinc-800">
                      {book.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      by {book.author}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteBook(book.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Book className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">ISBN: {book.isbn}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {book.category}
                  </Badge>
                  <Badge
                    variant={book.available > 0 ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {book.available}/{book.quantity} Available
                  </Badge>
                </div>
                {book.description && (
                  <p className="text-sm text-gray-600">{book.description}</p>
                )}
                <p className="text-xs text-gray-400">ID: {book.id}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {books.length === 0 && (
          <div className="text-center py-12">
            <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No books found</p>
          </div>
        )}
      </div>
    </main>
  )
}
