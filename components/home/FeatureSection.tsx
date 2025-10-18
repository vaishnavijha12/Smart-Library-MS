import {Search, Clock, Book} from 'lucide-react'
import FeatureCard from '@/components/home/FeatureCard'

export default function FeatureSection(){
    return(
      <section id="features" className="py-16 flex flex-col gap-12 justify-center items-center">
        <h2 className='z-1 text-4xl font-bold'>Features</h2>
        <div className="max-w-6xl container px-6 place-items-center grid md:grid-cols-3 grid-cols-1 gap-8">
          <FeatureCard
            icon={Search}
            title="Smart Search"
            description="Advanced search with filters and recommendations to find your next read instantly."
          />
          <FeatureCard
            icon={Clock}
            title="24/7 Access"
            description="Manage your library account anytime, anywhere with our cloud-based system."
          />
          <FeatureCard
            icon={Book}
            title="Smart Tracking"
            description="Automated tracking system for books, dues, and fines with timely notifications."
          />
        </div>
      </section>
    )
}