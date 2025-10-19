"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

interface MenuItemProps {
  name: string
  description: string
  price: string | number
  image: string
  index: number
}

export default function MenuItem({ name, description, price, image, index }: MenuItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatSomPrice = (value: string | number): string => {
    let numericValue: number | null = null

    if (typeof value === "number") {
      numericValue = Math.floor(value)
    } else if (typeof value === "string") {
      const trimmed = value.trim()
      if (trimmed.includes("$")) {
        const asFloat = Number.parseFloat(trimmed.replace(/[^0-9.]/g, ""))
        numericValue = isNaN(asFloat) ? null : Math.floor(asFloat)
      } else {
        const onlyDigits = trimmed.replace(/[^0-9]/g, "")
        numericValue = onlyDigits ? Number.parseInt(onlyDigits, 10) : null
      }
    }

    if (numericValue === null || isNaN(numericValue)) return "—"

    const parts = numericValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    return `${parts} so'm`
  }

  const displayPrice = formatSomPrice(price)

  return (
    <Card
      className="observe-animation group cursor-pointer overflow-hidden border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 bg-card p-0 gap-0 h-full hover:border-primary/50"
      style={{
        animationDelay: `${index * 100}ms`,
        opacity: 0,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        <p className="text-xs md:text-sm text-muted-foreground leading-snug mb-1 min-h-[1.5rem] line-clamp-2">
          {description}
        </p>

        <div
          className={`mt-auto inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-xs md:text-sm transition-all duration-500 whitespace-nowrap max-w-full ${
            isHovered ? "scale-110 shadow-lg" : "scale-100"
          }`}
        >
          {displayPrice}
        </div>
      </div>
    </Card>
  )
}
