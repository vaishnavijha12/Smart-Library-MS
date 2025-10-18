
export default function HeroSection(){
    return(
      <section className={cn("min-h-screen flex justify-center items-center relative overflow-hidden")}>
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:20px_20px]",
            "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
            "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
          )}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

        <div className="relative mx-auto px-6 py-16 flex flex-col justify-center items-center lg:gap-4 md:gap-6 gap-8 text-center">
          <h1 className="mx-auto max-w-6xl text-5xl md:text-6xl font-bold leading-tight">
            Your Digital Gateway to{' '}
            <span className="bg-gradient-to-r from-primary to-200% text-transparent bg-clip-text">
              Knowledge
            </span>
          </h1>
          <p className="max-w-[90%] md:max-w-[80%] lg:max-w-[70%] mx-auto text-xl md:text-2xl leading-relaxed text-muted-foreground">
            Discover a world of books, manage your reading journey, and explore endless possibilities with our modern
            library system.
          </p>
          <Link href="/auth/register">
            <Button variant="default" className="lg:px-4 mt-2">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    )
}