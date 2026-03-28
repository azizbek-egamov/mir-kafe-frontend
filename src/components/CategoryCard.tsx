import { useState } from 'react'
import { Link } from 'react-router-dom'

interface CategoryCardProps {
  id: number
  name: string
  image: string
  productCount: number
}

export default function CategoryCard({ id, name, image }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link to={`/category/${id}`} style={{ display: 'block', height: '100%' }}>
      <div
        className="observe-animation"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          opacity: 0,
          overflow: 'hidden',
          border: `1px solid ${isHovered ? 'var(--primary)' : 'rgba(var(--border-rgb, 200 200 200) / 0.5)'}`,
          boxShadow: isHovered ? '0 25px 50px -12px rgba(0,0,0,0.35)' : '0 10px 15px -3px rgba(0,0,0,0.15)',
          borderRadius: 'var(--radius)',
          backgroundColor: 'var(--card)',
          cursor: 'pointer',
          transition: 'all 0.5s',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius) var(--radius) 0 0' }}>
          <div style={{ position: 'absolute', inset: 0, transition: 'transform 0.7s', transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}>
            <img
              src={image || '/placeholder.svg'}
              alt={name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          {/* Hover overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(var(--primary-rgb, 139 0 0) / 0.4), transparent)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.5s',
          }} />
        </div>

        {/* Name */}
        <div style={{ padding: '0.5rem 0.75rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: isHovered ? 'var(--accent)' : 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.025em',
            marginBottom: '0.125rem',
            minHeight: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.3s',
          }}>
            {name}
          </h3>
        </div>
      </div>
    </Link>
  )
}
