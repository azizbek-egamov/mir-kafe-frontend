"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CategorySidebarProps {
  categories: Array<{ id: number; name: string }>
  selectedId: number
  onSelectCategory: (id: number) => void
}

export default function CategorySidebar({ categories, selectedId, onSelectCategory }: CategorySidebarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollUp, setCanScrollUp] = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(false)

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
      setCanScrollUp(scrollTop > 0)
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const container = scrollContainerRef.current
    container?.addEventListener("scroll", checkScroll)
    window.addEventListener("resize", checkScroll)
    return () => {
      container?.removeEventListener("scroll", checkScroll)
      window.removeEventListener("resize", checkScroll)
    }
  }, [categories])

  const scroll = (direction: "up" | "down") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 150
      scrollContainerRef.current.scrollBy({
        top: direction === "down" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="hidden lg:flex flex-col gap-2 w-32">
      {canScrollUp && (
        <Button variant="outline" size="sm" onClick={() => scroll("up")} className="h-8 w-full">
          <ChevronLeft className="w-4 h-4" />
        </Button>
      )}

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto scrollbar-hide flex flex-col gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`${
              selectedId === cat.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background/60 text-primary/70 border-primary/30 hover:bg-primary/10"
            } px-3 py-2 rounded-lg border text-sm font-semibold transition-all duration-300 text-center whitespace-normal break-words`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {canScrollDown && (
        <Button variant="outline" size="sm" onClick={() => scroll("down")} className="h-8 w-full">
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  )
}
