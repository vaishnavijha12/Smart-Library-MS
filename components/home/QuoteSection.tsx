import {Quote} from 'lucide-react'

export default function QuoteSection(){
    return(
        <section className="relative flex justify-center items-center py-12 my-20 bg-secondary">
        <div className="container mx-auto px-6 text-center">
          <Quote className="text-neutral-400 sm:w-10 sm:h-10 w-7 h-7 mb-8"/>
          <blockquote className="text-2xl sm:text-3xl md:text-4xl italic font-light mb-8 leading-relaxed">
            A room without books is like a body without a soul.
          </blockquote>
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-0.5 bg-muted-foreground"></div>
            <cite className="text-xl text-neutral-400">Marcus Tullius Cicero</cite>
            <div className="w-12 h-0.5 bg-muted-foreground"></div>
          </div>
        </div>
      </section>
    )
}