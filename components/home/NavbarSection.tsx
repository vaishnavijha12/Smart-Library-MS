'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import React from 'react'

/**
 * Minimal local Button component to avoid external dependency.
 */
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }> = ({ children, className = '', ...props }) => {
  return (
    <button {...props} className={['px-4 py-2 rounded', className].join(' ')}>
      {children}
    </button>
  )
}

/**
 * Minimal icon components replacing lucide-react icons.
 */
const BookOpenText: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20l-8-4V6a2 2 0 012-2h12a2 2 0 012 2v10l-8 4z" />
  </svg>
)

const User: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const Menu: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

const X: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function NavbarSection() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isProfile, setIsProfile] = useState<boolean>(false)
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  useEffect(() => { fetchUser() }, [])

  useEffect(() => {
    if (pathname === "/librarian/dashboard" || pathname === "/user/dashboard") {
      setIsProfile(false)
    } else {
      setIsProfile(true)
    }
  }, [pathname])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const logoutHandler = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      if (res.ok) router.push('/auth/login')
    } catch (err) {
      console.log(err)
    }
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const navbarHeight = 80
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - navbarHeight
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    }
  }

  return (
    <nav className="z-50 fixed top-0 w-full border-b bg-white/70 backdrop-blur-md shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => router.push('/')}>
          <BookOpenText className="w-8 h-8 text-indigo-500" />
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            LibraryMS
          </span>
        </div>

        {/* Desktop Links */}
        {(user === null) && (
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-300"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-300"
            >
              FAQ
            </button>
          </div>
        )}

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {user === null ? (
            <>
              <Link
                href="/auth/login"
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:scale-105 transition-all duration-300"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-5 py-2.5 rounded-lg border border-indigo-500 text-indigo-600 font-medium hover:bg-indigo-50 transition-all duration-300"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="h-5 w-5 text-indigo-500" />
                <span className="text-md font-semibold">{user.name}</span>
              </div>
              {user.role === "USER" ? (
                !isProfile ? (
                  <Link href="/user/profile" className="px-5 py-2.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition">
                    Profile
                  </Link>
                ) : (
                  <Link href="/user/dashboard" className="px-5 py-2.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition">
                    Home
                  </Link>
                )
              ) : (
                !isProfile ? (
                  <Link href="/librarian/profile" className="px-5 py-2.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition">
                    Profile
                  </Link>
                ) : (
                  <Link href="/librarian/dashboard" className="px-5 py-2.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition">
                    Home
                  </Link>
                )
              )}
              <Button
                onClick={logoutHandler}
                className="bg-gray-200 text-gray-800 hover:bg-indigo-400 hover:text-white transition-all duration-300"
              >
                Logout
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md border-t shadow-lg">
          <div className="flex flex-col items-center space-y-3 py-4">
            {user === null ? (
              <>
                <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-indigo-600 font-medium">Features</button>
                <button onClick={() => scrollToSection('faq')} className="text-gray-700 hover:text-indigo-600 font-medium">FAQ</button>
                <Link href="/auth/login" className="px-4 py-2 bg-indigo-500 text-white rounded-lg w-4/5 text-center">Login</Link>
                <Link href="/auth/register" className="px-4 py-2 border border-indigo-500 text-indigo-600 rounded-lg w-4/5 text-center">Sign Up</Link>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-indigo-500" />
                  <span className="text-md font-medium">{user.name}</span>
                </div>
                {user.role === "USER" ? (
                  !isProfile ? (
                    <Link href="/user/profile" className="px-4 py-2 bg-indigo-500 text-white rounded-lg w-4/5 text-center">Profile</Link>
                  ) : (
                    <Link href="/user/dashboard" className="px-4 py-2 bg-indigo-500 text-white rounded-lg w-4/5 text-center">Home</Link>
                  )
                ) : (
                  !isProfile ? (
                    <Link href="/librarian/profile" className="px-4 py-2 bg-indigo-500 text-white rounded-lg w-4/5 text-center">Profile</Link>
                  ) : (
                    <Link href="/librarian/dashboard" className="px-4 py-2 bg-indigo-500 text-white rounded-lg w-4/5 text-center">Home</Link>
                  )
                )}
                <Button
                  onClick={logoutHandler}
                  className="w-4/5 bg-gray-200 text-gray-800 hover:bg-indigo-400 hover:text-white transition"
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
