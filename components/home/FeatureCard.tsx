import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="group p-8 bg-neutral-50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
      <div className="bg-neutral-200 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-neutral-800 transition-colors duration-300">
        <Icon className="text-neutral-800 w-8 h-8 group-hover:text-white transition-colors duration-300" />
      </div>
      <h3 className="text-xl font-semibold mb-4 text-neutral-900">{title}</h3>
      <p className="text-neutral-600 leading-relaxed">{description}</p>
    </div>
  )
}
