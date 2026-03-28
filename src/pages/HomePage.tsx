import { useEffect, useRef, useState } from 'react'
import CategoryCard from '../components/CategoryCard'
import LoadingSpinner from '../components/LoadingSpinner'

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

const API_BASE = import.meta.env.VITE_API_BASE

export default function HomePage() {
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [categoryProducts, setCategoryProducts] = useState<Map<number, ApiProduct[]>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`${API_BASE}/category/`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        if (!res.ok) throw new Error(`API error: ${res.status}`)

        const data = await res.json()
        const catsArray: ApiCategory[] = Array.isArray(data) ? data : data.results || data.categories || []
        setCategories(catsArray)

        const map = new Map<number, ApiProduct[]>()
        for (const cat of catsArray) {
          try {
            const r = await fetch(`${API_BASE}/category/${cat.id}/`, { method: 'GET' })
            if (r.ok) {
              const d = await r.json()
              const prods: ApiProduct[] = Array.isArray(d.products) ? d.products : Array.isArray(d) ? d : d.results || []
              map.set(cat.id, prods)
            }
          } catch { /* ignore */ }
        }
        setCategoryProducts(map)
      } catch (e: any) {
        setError(e?.message || 'Yuklab bo\'lmadi')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Intersection Observer for animations
  useEffect(() => {
    if (!categories.length) return
    const timer = setTimeout(() => {
      observerRef.current = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-fade-in-up');
              (entry.target as HTMLElement).style.opacity = '1'
            }
          })
        },
        { threshold: 0.1 }
      )
      const els = document.querySelectorAll('.observe-animation')
      els.forEach(el => {
        observerRef.current?.observe(el)
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('animate-fade-in-up');
          (el as HTMLElement).style.opacity = '1'
        }
      })
    }, 100)
    return () => {
      clearTimeout(timer)
      observerRef.current?.disconnect()
    }
  }, [categories, categoryProducts])

  if (loading) {
    return (
      <section style={{ padding: '1rem', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner />
      </section>
    )
  }

  if (error) {
    return (
      <section style={{ padding: '1rem', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--destructive)' }}>Xato: {error}</div>
      </section>
    )
  }

  if (!categories.length) {
    return (
      <section style={{ padding: '1rem', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--muted-foreground)' }}>Kategoriyalar topilmadi</div>
      </section>
    )
  }

  return (
    <section style={{ padding: '0.5rem 1rem 7rem', backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
        }}
          className="category-grid"
        >
          {categories.map((cat, index) => {
            const products = categoryProducts.get(cat.id) || []
            return (
              <div key={cat.id} style={{ animationDelay: `${index * 100}ms` }}>
                <CategoryCard
                  id={cat.id}
                  name={cat.name}
                  image={products[0]?.photo || cat.photo || '/placeholder.svg'}
                  productCount={products.length}
                />
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .category-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 2rem !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .category-grid { gap: 1.5rem !important; }
        }
      `}</style>
    </section>
  )
}
