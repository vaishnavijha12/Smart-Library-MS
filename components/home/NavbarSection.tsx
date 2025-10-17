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
      } else {
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
        <nav className="w-full">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2 hover:scale-110 transition-transform duration-300">
            <BookOpenText className="w-8 h-8" />
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight"
            >
              LibraryMS
            </Link>
          </div>

          {(user === null) ?
          (<div className="space-x-4">
            <Link
              href="/auth/login"
            >
              <Button variant="outline">
                Login
              </Button>
            </Link>
            <Link
              href="/auth/register"
            >
              <Button variant="default">
                Sign Up
              </Button>
            </Link>
          </div>)
          :
          (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="border rounded-full p-2 h-9 w-9" />
              <span className="text-md font-medium">{user?.name}</span>
            </div>
            {(user?.role === "USER") ?
              ((!isProfile) ?
                (
                  <Link
                    href="/user/profile"
                  >
                    <Button 
                      variant="default"
                    >
                      Profile
                    </Button>
                  </Link>
                ):
                (
                  <Link
                    href="/user/dashboard"
                  >
                    <Button variant="outline">
                      Home
                    </Button>
                  </Link>
                )
              ) :
              ( (!isProfile)?
                (
                  <Link
                    href="/librarian/profile"
                  >
                    <Button variant="default">
                      Profile
                    </Button>
                  </Link>
                ) :
                (
                  <Link
                    href="/librarian/dashboard"
                  >
                    <Button variant="outline">
                      Home
                    </Button>
                  </Link>
                )
              )
            }
            
            <Button
              variant="default"
              onClick={logoutHandler}
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