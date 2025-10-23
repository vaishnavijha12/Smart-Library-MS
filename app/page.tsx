import HeroSection from '@/components/home/HeroSection'
import NavbarSection from '@/components/home/NavbarSection'
import FeatureSection from '@/components/home/FeatureSection'
import QuoteSection from '@/components/home/QuoteSection'
import FAQSection from '@/components/home/FAQSection'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/auth'

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <NavbarSection/>
      <HeroSection/>
      <FeatureSection/>
      <QuoteSection/>
      <FAQSection/>
    </div>
  )
}
