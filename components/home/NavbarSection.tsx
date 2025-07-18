import Link from 'next/link'
import {BookOpen} from 'lucide-react'
export default function NavbarSection(){
    return(
        <nav className="bg-neutral-900 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <BookOpen className="text-neutral-300 w-8 h-8 hover:scale-110 transition-transform duration-300" />
            <Link
              href="/"
              className="text-white text-2xl font-bold tracking-tight hover:text-neutral-400 transition-colors duration-300"
            >
              LibraryMS
            </Link>
          </div>
          
          <div className="space-x-4">
            <Link
              href="/auth/login"
              className="text-white px-5 py-2.5 rounded-lg hover:bg-neutral-800 border-2 border-neutral-500 transition-all duration-300 hover:border-neutral-400"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="text-white px-5 py-2.5 rounded-lg hover:bg-neutral-800 border-2 border-neutral-500 transition-all duration-300 hover:border-neutral-400"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    )
}