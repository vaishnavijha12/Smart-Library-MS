'use client'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {BookOpenText,User} from 'lucide-react'
import {useEffect,useState} from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function NavbarSection(){
    const pathname = usePathname()
    const router = useRouter();
  const [user,setUser] = useState<User | null>(null);
    const [isProfile,setIsProfile] = useState<boolean>(false);

    useEffect(() => {
      fetchUser()
    }, [])

    useEffect(() => {
      if(pathname === "/librarian/dashboard" || pathname === "/user/dashboard"){
        setIsProfile(false)
      } else{
        setIsProfile(true)
      }
    }, [pathname])

    const fetchUser = async () => {
      try{
        const res = await fetch('/api/auth/me')
        if(res.ok){
          const data = await res.json();
          setUser(data.user)
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
        console.log(err);
      }
    }

    return(
        <nav className="z-1 fixed top-0 w-full border-b bg-background">
        <div className="max-w-8xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2 hover:scale-110 transition-transform duration-300">
            <BookOpenText className="w-8 h-8 text-purple-400" />
            <Link
              href="/"
              className="text-black text-2xl font-bold tracking-tight group-hover:opacity-60 transition-colors duration-300"
            >
              LibraryMS
            </Link>
          </div>
          {(user === null) ?
          (<div className="space-x-4">
            <Link
              href="/auth/login"
              className="text-white bg-indigo-600 px-5 py-2.5 rounded-lg hover:bg-indigo-500 transition-all duration-300 "
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="text-white bg-indigo-600 px-5 py-2.5 rounded-lg hover:bg-indigo-500 transition-all duration-300 "
            >
              Sign Up
            </Link>
          </div>)
          :
          (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-black">
              <User className=" text-gray-500 h-5 w-5" />
              <span className="text-md font-medium">{user.name}</span>
            </div>
            {(user.role === "USER") ?
              ( (!isProfile) ?
                (
                  <Link
                    href="/user/profile"
                    className="text-white bg-indigo-400 px-5 py-2.5 rounded-lg hover:bg-indigo-500 hover:border-1 transition-all duration-300 hover:border-neutral-400"
                  >
                    Profile
                  </Link>
                ):
                (
                  <Link
                    href="/user/dashboard"
                    className="text-white bg-indigo-400 px-5 py-2.5 rounded-lg hover:bg-indigo-500 hover:border-1 transition-all duration-300 hover:border-neutral-400"
                  >
                    Home
                  </Link>
                )
              ) :
              ( (!isProfile)?
                (
                  <Link
                    href="/librarian/profile"
                    className="text-white px-5 text-md  bg-indigo-400 py-2.5 rounded-lg hover:bg-indigo-500 hover:border-1 transition-all duration-300 hover:border-neutral-400"
                  >
                    Profile
                  </Link>
                ) :
                (
                  <Link
                    href="/librarian/dashboard"
                    className="text-white px-5 py-2.5 rounded-lg bg-indigo-400 hover:bg-indigo-500  border-neutral-500 transition-all duration-300 hover:border-neutral-400"
                  >
                    Home
                  </Link>
                )
              )
            }
            
            <Button
              onClick={logoutHandler}
              className="text-black bg-gray-200 px-5.5 text-md  py-5.5 rounded-lg hover:bg-indigo-400 hover:text-white   transition-all duration-300 "
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