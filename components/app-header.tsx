"use client"

import { ThemeToggle } from "@/components/theme-toggle"

export default function AppHeader() {
  return (
    <header className="bg-background pt-8 pb-4 px-4 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="absolute top-2 right-2 md:top-8 md:right-4 z-50">
          <ThemeToggle />
        </div>

        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-center mb-4 tracking-tight font-serif bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-fade-in-up">
          MIR RESTAURANT
        </h1>
        <div className="flex items-center justify-center animate-slide-in-left">
          <div className="flex gap-2">
            {["M", "E", "N", "Y", "U"].map((letter, i) => (
              <div
                key={letter}
                className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                style={{
                  animationDelay: `${i * 100}ms`,
                }}
              >
                <span className="font-bold text-lg text-primary">{letter}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
