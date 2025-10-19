"use client"

import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"

interface CategoryCardProps {
  id: number
  name: string
  image: string
  productCount: number
}

export default function CategoryCard({ id, name, image, productCount }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/category/${id}`}>
      <Card
        className="observe-animation group cursor-pointer overflow-hidden border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card p-0 gap-0 h-full hover:border-primary/50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ opacity: 0 }}
      >
        <div className="relative w-full aspect-square overflow-hidden bg-muted rounded-t-lg">
          <div className={`absolute inset-0 transition-transform duration-700 ${isHovered ? "scale-110" : "scale-100"}`}>
            <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
          </div>

          <div
            className={`absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent transition-opacity duration-500 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        <div className="px-3 pt-2 pb-2 text-center flex flex-col items-center flex-1">
          <h3 className="text-base font-bold text-primary uppercase tracking-wide mb-0.5 group-hover:text-accent transition-colors duration-300 min-h-[1.5rem] flex items-center justify-center">
            {name}
          </h3>
        </div>
      </Card>
    </Link>
  )
}
