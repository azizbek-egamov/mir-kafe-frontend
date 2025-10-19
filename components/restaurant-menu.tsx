// Keeping for backward compatibility if needed
"use client"

import { useEffect, useRef, useState } from "react"
import MenuItem from "./menu-item"

interface ApiProduct {
  id: number
  name: string
  description: string
  price: number
  photo: string
  category: number
  category_name: string
  created_at: string
}

interface ApiCategory {
  category_id: number
  category: string
  products: ApiProduct[]
}

interface ApiSettings {
  instagram?: string
  telegram?: string
  phone?: string
}

interface ApiResponse {
  settings: ApiSettings
  categories: ApiCategory[]
}

export default function RestaurantMenu() {
  const [isVisible, setIsVisible] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [settings, setSettings] = useState<ApiSettings>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE
  const [selectedCategoryId, setSelectedCategoryId] = useState<"all" | number>("all")
  const categoriesBarRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef<boolean>(false)
  const dragStartXRef = useRef<number>(0)
  const dragScrollLeftRef = useRef<number>(0)

  useEffect(() => {
    setIsVisible(true)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".observe-animation")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`${API_BASE}/products/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        })
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        const data = (await res.json()) as ApiResponse
        setCategories(Array.isArray(data.categories) ? data.categories : [])
        const newSettings = data.settings || {}
        setSettings(newSettings)

        // Send settings to footer via custom event and localStorage
        localStorage.setItem("restaurant-settings", JSON.stringify(newSettings))
        window.dispatchEvent(new CustomEvent("settings-updated", { detail: newSettings }))
      } catch (e: any) {
        setError(e?.message || "Failed to load products")
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [API_BASE])

  // Re-observe newly rendered elements after categories load, so opacity-0 is removed
  useEffect(() => {
    if (!categories.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up")
          }
        })
      },
      { threshold: 0.1 },
    )
    const elements = document.querySelectorAll(".observe-animation")
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [categories])

  // Dev tools and context actions are currently allowed (user request)

  // Enable mouse drag-to-scroll for the categories bar (desktop UX)
  useEffect(() => {
    const el = categoriesBarRef.current
    if (!el) return
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true
      dragStartXRef.current = e.pageX - el.offsetLeft
      dragScrollLeftRef.current = el.scrollLeft
      el.classList.add("cursor-grabbing")
    }
    const onMouseLeave = () => {
      isDraggingRef.current = false
      el.classList.remove("cursor-grabbing")
    }
    const onMouseUp = () => {
      isDraggingRef.current = false
      el.classList.remove("cursor-grabbing")
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      e.preventDefault()
      const x = e.pageX - el.offsetLeft
      const walk = x - dragStartXRef.current
      el.scrollLeft = dragScrollLeftRef.current - walk
    }
    el.addEventListener("mousedown", onMouseDown)
    el.addEventListener("mouseleave", onMouseLeave)
    el.addEventListener("mouseup", onMouseUp)
    el.addEventListener("mousemove", onMouseMove)
    return () => {
      el.removeEventListener("mousedown", onMouseDown)
      el.removeEventListener("mouseleave", onMouseLeave)
      el.removeEventListener("mouseup", onMouseUp)
      el.removeEventListener("mousemove", onMouseMove)
    }
  }, [categories])

  return (
    <div className="w-full relative overflow-x-hidden">
      {/* Corner Decorations removed */}

      {/* Header moved to layout. Keep only Categories Bar here if needed */}
      <div className="px-4">
        {!!categories.length && (
          <div className="max-w-7xl mx-auto">
            <div
              ref={categoriesBarRef}
              className="mt-4 mb-2 overflow-x-auto scrollbar-hide whitespace-nowrap px-1 cursor-grab select-none bg-background"
            >
              {/* All category */}
              <button
                key="all"
                onClick={() => {
                  setSelectedCategoryId("all")
                }}
                className={`${selectedCategoryId === "all" ? "bg-transparent text-primary border-primary border-b-2" : "bg-background/60 text-primary/70 border-primary/30"} inline-flex items-center mx-1 mb-2 rounded-full border backdrop-blur px-4 py-2 text-[15px] md:text-base font-semibold hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors`}
              >
                Barchasi
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.category_id}
                  onClick={() => {
                    setSelectedCategoryId(cat.category_id)
                    const el = document.getElementById(`cat-${cat.category_id}`)
                    el?.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
                  }}
                  className={`${selectedCategoryId === cat.category_id ? "bg-transparent text-primary border-primary border-b-2" : "bg-background/60 text-primary/70 border-primary/30"} inline-flex items-center mx-1 mb-2 rounded-full border backdrop-blur px-4 py-2 text-[15px] md:text-base font-semibold hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors`}
                >
                  {cat.category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* API-driven Sections */}
      {loading && (
        <section className="relative z-10 pb-20 md:pb-20 lg:pb-24 pt-4 px-4">
          <div className="max-w-7xl mx-auto text-center text-muted-foreground">Yuklanmoqda…</div>
        </section>
      )}

      {error && (
        <section className="relative z-10 pb-20 md:pb-20 lg:pb-24 pt-4 px-4">
          <div className="max-w-7xl mx-auto text-center text-destructive">{error}</div>
        </section>
      )}

      {categories.map((cat, index) => (
        <section
          id={`cat-${cat.category_id}`}
          key={cat.category_id}
          className={`relative z-10 ${index === categories.length - 1 ? "pb-26 md:pb-26 lg:pb-28" : "pb-5 md:pb-8 lg:pb-8"} pt-4 px-4 scroll-mt-28 ${selectedCategoryId !== "all" && selectedCategoryId !== cat.category_id ? "hidden" : ""}`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-8 mb-12">
              <div className="flex-1 h-px bg-border" />
              <h2 className="text-3xl md:text-4xl font-bold text-secondary uppercase tracking-wider observe-animation opacity-0">
                {cat.category}
              </h2>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
              {cat.products.map((p, index) => (
                <MenuItem
                  key={p.id}
                  name={p.name}
                  description={p.description}
                  price={p.price}
                  image={p.photo}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Footer moved to layout */}
    </div>
  )
}
