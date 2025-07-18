'use client'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {BookOpen} from 'lucide-react'
import {useEffect,useState} from 'react'
import { useRouter } from 'next/navigation'

export default function NavbarSection(){
    const router = useRouter();
    const [token,setToken] = useState<string>('');

    useEffect(() => {
      fetchToken()
    }, [])

    const fetchToken = async () => {
      try{
        const res = await fetch('/api/auth/me')
        if(res.ok){
          const data = await res.json();
          setToken(data.AuthToken)
        }
      } catch(err){
        console.log(err);
      }
      
    }

    const logoutHandler = async() => {
      try{
        const res = await fetch('/api/auth/logout',{
          method: 'POST',
           headers: { 'Content-Type': 'application/json' }
        })
        if(res.ok) router.push('/auth/login')
      } catch(err){
        console.log(error);
      }
    }
    return(
        <nav className="bg-neutral-900 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <BookOpen className="text-neutral-300 w-8 h-8 hover:scale-110 transition-transform duration-300" />
            <Link
              href="/"
              className="text-white text-2xl font-bold tracking-tight hover:text-neutral-400 transition-colors duration-300"
            >
              LibraryMS
            </Link>
          </div>
          {(token === null) ?
          (<div className="space-x-4">
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
          </div>)
          :
          (
            <div className="space-x-4">
            <Link
              href="/"
              className="text-white px-5 py-2.5 rounded-lg hover:bg-neutral-800 border-2 border-neutral-500 transition-all duration-300 hover:border-neutral-400"
            >
              Profile
            </Link>
            <Button
              onClick={logoutHandler}
              className="text-white px-5 py-5 rounded-lg hover:bg-neutral-800 border-2 border-neutral-500 transition-all duration-300 hover:border-neutral-400"
            >
              Logout
            </Button>
          </div>
          )
          }
          
        </div>
      </nav>
    )
}