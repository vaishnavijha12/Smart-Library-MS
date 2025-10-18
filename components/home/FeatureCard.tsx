import { LucideIcon } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import Image from 'next/image'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  image?: string
}

export default function FeatureCard({ icon: Icon, title, description, image }: FeatureCardProps) {
  return (
    <Card className='group relative h-full w-full max-w-sm select-none overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-2 hover:border-primary/50'>
      {/* Gradient overlay on hover */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-purple-500/5 transition-all duration-500 z-10 pointer-events-none' />
      
      {image && (
        <div className='relative w-full h-48 overflow-hidden'>
          <Image
            src={image}
            alt={title}
            fill
            className='object-cover transition-transform duration-700 group-hover:scale-110'
          />
          {/* Overlay gradient */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />
        </div>
      )}
      <CardHeader className='gap-4 relative z-20'>
        <div className='flex gap-4 items-center'>
          <div className='p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300'>
            <Icon className='text-primary w-6 h-6 group-hover:scale-110 transition-transform duration-300'/>
          </div>
          <CardTitle className='text-xl font-bold group-hover:text-primary transition-colors duration-300'>
            {title}
          </CardTitle>
        </div>
        <CardDescription className='text-base leading-relaxed group-hover:text-foreground/80 transition-colors duration-300'>
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
