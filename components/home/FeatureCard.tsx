import { LucideIcon } from 'lucide-react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className='h-full w-full max-w-sm select-none hover:scale-105 duration-300'>
      <CardHeader className='gap-4'>
        <div className='flex gap-4 items-center'>
          <Icon className='text-primary'/>
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
