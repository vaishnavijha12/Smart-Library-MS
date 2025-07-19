import HeroSection from '@/components/home/HeroSection'
import NavbarSection from '@/components/home/NavbarSection'
import FeatureSection from '@/components/home/FeatureSection'
import QuoteSection from '@/components/home/QuoteSection'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/auth'

export default function Home() {
  const cookieStore = cookies()
  const token = cookieStore.get('auth-token')?.value

  if (token) {
      const payload = verifyToken(token)

      if (payload) {
      if (payload.role === 'USER') {
          redirect('/user/dashboard')
      } else {
          redirect('/librarian/dashboard')
      }
      }
  }
  return (
    <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 min-h-screen flex flex-col">

      <NavbarSection/>

      <HeroSection/>

      <FeatureSection/>

      <QuoteSection/>
      
    </div>
  )
}
