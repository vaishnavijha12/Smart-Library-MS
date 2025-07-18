import {Quote} from 'lucide-react'

export default function QuoteSection(){
    return(
        <section className="relative bg-neutral-800 text-white py-16">
        <div className="container mx-auto px-6 text-center relative">
          <Quote className="text-neutral-400 w-12 h-12 mb-6" />
          <blockquote className="text-3xl md:text-4xl italic font-light mb-8 leading-relaxed">
            "A room without books is like a body without a soul."
          </blockquote>
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-0.5 bg-neutral-500"></div>
            <cite className="text-xl text-neutral-400">Marcus Tullius Cicero</cite>
            <div className="w-12 h-0.5 bg-neutral-500"></div>
          </div>
        </div>
      </section>
    )
}