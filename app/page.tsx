import HeroSection from '@/components/home/HeroSection'
import NavbarSection from '@/components/home/NavbarSection'
import FeatureSection from '@/components/home/FeatureSection'
import QuoteSection from '@/components/home/QuoteSection'

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 min-h-screen flex flex-col">
      
      <NavbarSection/>

      <HeroSection/>

      <FeatureSection/>

      <QuoteSection/>
      
    </div>
  )
}
