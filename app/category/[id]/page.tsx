"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import MenuItem from "@/components/menu-item"
import Link from "next/link"

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
}

export default function CategoryPage() {
  const params = useParams()
  const categoryId = Number(params.id)
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE

  const checkScrollButtons = () => {
    const container = document.getElementById("categories-nav")
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0)
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth)
    }
  }

  const scrollLeft = () => {
    const container = document.getElementById("categories-nav")
    if (container) {
      container.scrollBy({ left: -200, behavior: "smooth" })
      setTimeout(checkScrollButtons, 150)
    }
  }

  const scrollRight = () => {
    const container = document.getElementById("categories-nav")
    if (container) {
      container.scrollBy({ left: 200, behavior: "smooth" })
      setTimeout(checkScrollButtons, 150)
    }
  }

  useEffect(() => {
    const container = document.getElementById("categories-nav")
    if (container) {
      checkScrollButtons()
      container.addEventListener("scroll", checkScrollButtons)
      window.addEventListener("resize", checkScrollButtons)

      return () => {
        container.removeEventListener("scroll", checkScrollButtons)
        window.removeEventListener("resize", checkScrollButtons)
      }
    }
  }, [categories])

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const categoriesRes = await fetch(`${API_BASE}/category/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (!categoriesRes.ok) throw new Error(`Failed to load categories: ${categoriesRes.status}`)

        const categoriesData = await categoriesRes.json()
        const categoriesArray = Array.isArray(categoriesData) ? categoriesData : categoriesData.results || []
        setCategories(categoriesArray)

        const productsRes = await fetch(`${API_BASE}/category/${categoryId}/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (!productsRes.ok) throw new Error(`Failed to load products: ${productsRes.status}`)

        const productsData = await productsRes.json()
        console.log("[CategoryPage] Products data:", productsData)

        // Backend returns products in data.products field
        const productsArray = Array.isArray(productsData.products)
          ? productsData.products
          : Array.isArray(productsData)
            ? productsData
            : productsData.results || []

        console.log("[CategoryPage] Parsed products:", productsArray)
        setProducts(productsArray)

        // Set category name
        const selectedCat = categoriesArray.find((c: ApiCategory) => c.id === categoryId)
        setSelectedCategoryName(selectedCat?.name || "")
      } catch (e: any) {
        setError(e?.message || "Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [API_BASE, categoryId])

  // Intersection Observer for animations
  useEffect(() => {
    if (!products.length) return

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
        { threshold: 0.1 },
      )

      const elements = document.querySelectorAll(".observe-animation")
      console.log("[CategoryPage] Found elements for animation:", elements.length)
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
  }, [products])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-muted-foreground">Yuklanmoqda…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-destructive">{error}</div>
      </div>
    )
  }

  return (
    <div className="px-4 py-4 pb-32 bg-background min-h-screen">
      {/* Categories Navigation - Yuqori markaz */}
      <div className="max-w-7xl mx-auto mb-4">
        <div className="flex items-center justify-center relative">
          {/* Left scroll button */}
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 z-10 bg-background/90 hover:bg-background text-primary p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 border border-border backdrop-blur-sm"
              aria-label="Chapga surish"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Categories horizontal scroll */}
          <div
            id="categories-nav"
            className="flex overflow-x-auto scrollbar-hide gap-4 px-4 py-4 mx-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Home button at the beginning */}
            <Link
              href="/"
              className="px-6 py-3 rounded-full text-sm md:text-base font-bold uppercase tracking-wide whitespace-nowrap transition-all duration-300 hover:scale-105 bg-muted hover:bg-primary/20 text-primary border border-border/50 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="hidden sm:inline">Bosh sahifa</span>
            </Link>

            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className={`px-6 py-3 rounded-full text-sm md:text-base font-bold uppercase tracking-wide whitespace-nowrap transition-all duration-300 hover:scale-105 ${
                  category.id === categoryId
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted hover:bg-primary/20 text-primary border border-border/50"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Right scroll button */}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-0 z-10 bg-background/90 hover:bg-background text-primary p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 border border-border backdrop-blur-sm"
              aria-label="O'ngga surish"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto">
        {/* Selected category name */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-wider mb-6 text-center">
          {selectedCategoryName}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
          {products.map((product, index) => (
            <MenuItem
              key={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              image={product.photo}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
