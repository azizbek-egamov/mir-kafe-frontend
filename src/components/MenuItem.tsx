import { useState } from 'react'
import ImageLightbox from './ImageLightbox'

interface MenuItemProps {
  name: string
  description: string | null
  price: string | number
  image: string | null
  index: number
}

function formatSomPrice(value: string | number): string {
  let numericValue: number | null = null
  if (typeof value === 'number') {
    numericValue = Math.floor(value)
  } else if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed.includes('$')) {
      const f = parseFloat(trimmed.replace(/[^0-9.]/g, ''))
      numericValue = isNaN(f) ? null : Math.floor(f)
    } else {
      const d = trimmed.replace(/[^0-9]/g, '')
      numericValue = d ? parseInt(d, 10) : null
    }
  }
  if (numericValue === null || isNaN(numericValue)) return '—'
  const parts = numericValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${parts} so'm`
}

export default function MenuItem({ name, description, price, image, index }: MenuItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false)

  return (
    <div
      className="observe-animation"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity: 0,
        animationDelay: `${index * 100}ms`,
        overflow: 'hidden',
        border: `1px solid ${isHovered ? 'var(--primary)' : 'rgba(200,200,200,0.3)'}`,
        boxShadow: isHovered ? '0 25px 50px -12px rgba(0,0,0,0.35)' : '0 10px 15px -3px rgba(0,0,0,0.15)',
        borderRadius: 'var(--radius)',
        backgroundColor: 'var(--card)',
        cursor: 'pointer',
        transition: 'all 0.5s',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Image */}
      <div
        onClick={() => setShowLightbox(true)}
        style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius) var(--radius) 0 0' }}>
        <div style={{ position: 'absolute', inset: 0, transition: 'transform 0.7s', transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}>
          <img
            src={image || '/placeholder.svg'}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(90,20,20,0.4), transparent)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.5s',
        }} />
      </div>

      {/* Info */}
      <div style={{ padding: '0.5rem 0.75rem 0.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
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
        <p style={{
          fontSize: '0.75rem',
          color: 'var(--muted-foreground)',
          lineHeight: 1.4,
          marginBottom: '0.25rem',
          minHeight: '1.5rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {description}
        </p>
        <div style={{
          marginTop: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.375rem 1rem',
          borderRadius: '9999px',
          background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
          color: 'var(--primary-foreground)',
          fontWeight: 700,
          fontSize: '0.75rem',
          transition: 'all 0.5s',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
          whiteSpace: 'nowrap',
        }}>
          {formatSomPrice(price)}
        </div>
      </div>

      {showLightbox && image && (
        <ImageLightbox
          src={image}
          alt={name}
          onClose={() => setShowLightbox(false)}
        />
      )}
    </div>
  )
}
