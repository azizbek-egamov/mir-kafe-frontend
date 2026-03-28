import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import MenuItem from '../components/MenuItem'
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
}

const API_BASE = import.meta.env.VITE_API_BASE

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>()
  const categoryId = Number(id)
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [products, setProducts] = useState<ApiProduct[]>([])
  const [selectedCategoryName, setSelectedCategoryName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const checkScroll = () => {
    const el = navRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth)
  }

  useEffect(() => {
    const el = navRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [categories])

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        const catsRes = await fetch(`${API_BASE}/category/`, { method: 'GET' })
        if (!catsRes.ok) throw new Error(`Kategoriyalar yuklanmadi: ${catsRes.status}`)
        const catsData = await catsRes.json()
        const catsArr: ApiCategory[] = Array.isArray(catsData) ? catsData : catsData.results || []
        setCategories(catsArr)

        const prodsRes = await fetch(`${API_BASE}/category/${categoryId}/`, { method: 'GET' })
        if (!prodsRes.ok) throw new Error(`Mahsulotlar yuklanmadi: ${prodsRes.status}`)
        const prodsData = await prodsRes.json()
        const prodsArr: ApiProduct[] = Array.isArray(prodsData.products)
          ? prodsData.products
          : Array.isArray(prodsData)
            ? prodsData
            : prodsData.results || []
        setProducts(prodsArr)

        const sel = catsArr.find(c => c.id === categoryId)
        setSelectedCategoryName(sel?.name || '')
      } catch (e: any) {
        setError(e?.message || 'Yuklab bo\'lmadi')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [categoryId])

  useEffect(() => {
    if (!products.length) return
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
  }, [products])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', backgroundColor: 'transparent' }}>
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', backgroundColor: 'var(--background)' }}>
        <div style={{ color: 'var(--destructive)' }}>{error}</div>
      </div>
    )
  }

  const navBtnBase: React.CSSProperties = {
    padding: '0.75rem 1.5rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
    transition: 'all 0.3s',
    border: '1px solid rgba(200,200,200,0.3)',
    cursor: 'pointer',
    display: 'inline-block',
    textDecoration: 'none',
  }

  return (
    <div style={{ padding: '1rem 1rem 8rem', backgroundColor: 'transparent', minHeight: '100vh' }}>
      {/* Categories Nav */}
      <div style={{ maxWidth: '80rem', margin: '0 auto 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* Scroll left */}
          {canScrollLeft && (
            <button
              onClick={() => { navRef.current?.scrollBy({ left: -200, behavior: 'smooth' }); setTimeout(checkScroll, 150) }}
              aria-label="Chapga"
              style={{
                position: 'absolute', left: 0, zIndex: 10,
                background: 'var(--background)', border: '1px solid var(--border)',
                color: 'var(--primary)', borderRadius: '9999px', padding: '0.5rem',
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s',
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Nav scroll area */}
          <div
            ref={navRef}
            style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '1rem',
              padding: '1rem',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className="scrollbar-hide"
          >
            {/* Home */}
            <Link
              to="/"
              style={{ ...navBtnBase, backgroundColor: 'var(--muted)', color: 'var(--primary)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(139,0,0,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--muted)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="home-label">Bosh sahifa</span>
              </span>
            </Link>

            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                style={{
                  ...navBtnBase,
                  backgroundColor: cat.id === categoryId ? 'var(--primary)' : 'var(--muted)',
                  color: cat.id === categoryId ? 'var(--primary-foreground)' : 'var(--primary)',
                  boxShadow: cat.id === categoryId ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
                }}
                onMouseEnter={e => { if (cat.id !== categoryId) { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(139,0,0,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)' } }}
                onMouseLeave={e => { if (cat.id !== categoryId) { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--muted)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)' } }}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Scroll right */}
          {canScrollRight && (
            <button
              onClick={() => { navRef.current?.scrollBy({ left: 200, behavior: 'smooth' }); setTimeout(checkScroll, 150) }}
              aria-label="O'ngga"
              style={{
                position: 'absolute', right: 0, zIndex: 10,
                background: 'var(--background)', border: '1px solid var(--border)',
                color: 'var(--primary)', borderRadius: '9999px', padding: '0.5rem',
                cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Products grid */}
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: 700,
          color: 'var(--foreground)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '1.5rem',
          textAlign: 'center',
        }}>
          {selectedCategoryName}
        </h1>

        <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {products.map((p, i) => (
            <MenuItem
              key={p.id}
              name={p.name}
              description={p.description}
              price={p.price}
              image={p.photo}
              index={i}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .products-grid { grid-template-columns: repeat(4, 1fr) !important; gap: 2rem !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .products-grid { gap: 1.5rem !important; }
        }
        @media (max-width: 640px) {
          .home-label { display: none; }
        }
      `}</style>
    </div>
  )
}
