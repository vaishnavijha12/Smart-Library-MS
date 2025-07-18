
export default function HeroSection(){
    return(
        <section className="relative overflow-hidden bg-neutral-800 text-white">
        <div className="relative container mx-auto px-6 py-15 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-2 leading-tight">
            Your Digital Gateway to{' '}
            <span className="bg-gradient-to-r from-neutral-200 to-neutral-100 text-transparent bg-clip-text">
              Knowledge
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-neutral-300 leading-relaxed">
            Discover a world of books, manage your reading journey, and explore endless possibilities with our modern
            library system.
          </p>
          
        </div>
      </section>
    )
}