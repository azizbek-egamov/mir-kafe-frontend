"use client"

import { useEffect, useState } from "react"
import CategoryCard from "./category-card"

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
  id: number
  name: string
  photo?: string
}

export default function LandingCategories() {
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [categoryProducts, setCategoryProducts] = useState<Map<number, ApiProduct[]>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("[v0] API_BASE:", API_BASE)

        if (!API_BASE) {
          throw new Error("API_BASE environment variable not set")
        }

        const res = await fetch(`${API_BASE}/category/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        console.log("[v0] Categories response status:", res.status)

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`)
        }

        const data = await res.json()
        console.log("[v0] Categories data:", data)

        // Handle both array and object responses
        const categoriesArray = Array.isArray(data) ? data : data.results || data.categories || []
        console.log("[v0] Categories array:", categoriesArray)
        setCategories(categoriesArray)

        // Load products for each category to get first image
        const productsMap = new Map<number, ApiProduct[]>()
        for (const cat of categoriesArray) {
          try {
            const catRes = await fetch(`${API_BASE}/category/${cat.id}/`, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            })
            if (catRes.ok) {
              const catData = await catRes.json()
              console.log(`[v0] Category ${cat.id} products data:`, catData)
              
              // Backend returns products in data.products field
              const products = Array.isArray(catData.products) 
                ? catData.products 
                : Array.isArray(catData) 
                ? catData 
                : catData.results || []
              
              console.log(`[v0] Category ${cat.id} parsed products:`, products)
              productsMap.set(cat.id, products)
            }
          } catch (e) {
            // Silently handle category product loading errors
          }
        }
        setCategoryProducts(productsMap)
      } catch (e: any) {
        console.log("[v0] Error loading categories:", e)
        setError(e?.message || "Failed to load categories")
      } finally {
        setLoading(false)
      }
    }
    loadCategories()
  }, [API_BASE])

  // Intersection Observer for animations
  useEffect(() => {
    if (!categories.length) return
    
    // Slight delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate-fade-in-up")
              ;(entry.target as HTMLElement).style.opacity = "1"
            }
          })
        },
        { threshold: 0.1 }
      )

      const elements = document.querySelectorAll(".observe-animation")
      console.log("[v0] Found elements for animation:", elements.length)
      elements.forEach((el) => observer.observe(el))

      // Also set opacity to 1 for immediate visibility if elements are already in view
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0
        if (isVisible) {
          el.classList.add("animate-fade-in-up")
          ;(el as HTMLElement).style.opacity = "1"
        }
      })
    }, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [categories, categoryProducts])

  if (loading) {
    return (
      <section className="relative z-10 pb-20 md:pb-20 lg:pb-24 pt-2 px-4 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">Yuklanmoqda…</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="relative z-10 pb-20 md:pb-20 lg:pb-24 pt-2 px-4 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto text-center text-destructive">Xato: {error}</div>
      </section>
    )
  }

  if (categories.length === 0) {
    return (
      <section className="relative z-10 pb-20 md:pb-20 lg:pb-24 pt-2 px-4 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">Kategoriyalar topilmadi</div>
      </section>
    )
  }

  return (
    <section className="relative z-10 pb-20 md:pb-20 lg:pb-24 pt-2 px-4 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {categories.map((cat, index) => {
            const products = categoryProducts.get(cat.id) || []
            return (
              <div key={cat.id} style={{ animationDelay: `${index * 100}ms` }}>
                <CategoryCard
                  id={cat.id}
                  name={cat.name}
                  image={products[0]?.photo || cat.photo || "/placeholder.svg"}
                  productCount={products.length}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
