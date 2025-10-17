import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";

export default function HeroSection(){
    return(
      <section className={cn("min-h-screen flex justify-center items-center relative overflow-hidden")}>
        <div className="relative mx-auto px-6 py-16 flex flex-col justify-center items-center lg:gap-4 md:gap-6 gap-8 text-center">
          <h1 className="mx-auto max-w-6xl text-5xl md:text-6xl font-bold leading-tight">
            Your Digital Gateway to{' '}
            <span className="bg-gradient-to-r from-neutral-500 to-neutral-100 text-transparent bg-clip-text">
              Knowledge
            </span>
          </h1>
          <p className="max-w-[90%] md:max-w-[80%] lg:max-w-[70%] mx-auto text-xl md:text-2xl text-neutral-300 leading-relaxed">
            Discover a world of books, manage your reading journey, and explore endless possibilities with our modern
            library system.
          </p>
          <Link href="/auth/register">
            <Button variant="default" className="lg:px-4 md:text-base text-sm mt-2">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    )
}