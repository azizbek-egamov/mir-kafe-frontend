import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function AppHeader() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header style={{
      backgroundColor: 'var(--background)',
      paddingTop: '2rem',
      paddingBottom: '1rem',
      paddingLeft: '1rem',
      paddingRight: '1rem',
      position: 'relative',
    }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Theme Toggle */}
        <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 50 }}>
          <button
            onClick={toggleTheme}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--border)',
              backgroundColor: 'rgba(var(--background), 0.8)',
              color: 'var(--foreground)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: 'var(--background)',
              backdropFilter: 'blur(8px)',
            }}
            aria-label="Toggle theme"
          >
            {theme === 'dark'
              ? <Sun size={18} color="var(--foreground)" />
              : <Moon size={18} color="var(--foreground)" />
            }
          </button>
        </div>

        {/* Title */}
        <h1
          className="animate-fade-in-up"
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 6rem)',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '1rem',
            letterSpacing: '-0.025em',
            fontFamily: "'Rowdies', serif",
            background: 'linear-gradient(90deg, var(--primary), var(--secondary), var(--primary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          MIR RESTAURANT
        </h1>

        {/* MENYU letters */}
        <div
          className="animate-slide-in-left"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['M', 'E', 'N', 'Y', 'U'].map((letter, i) => (
              <div
                key={letter}
                style={{
                  width: '3rem',
                  height: '3rem',
                  borderRadius: '9999px',
                  border: '2px solid var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  animationDelay: `${i * 100}ms`,
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(var(--primary-rgb, 139 0 0) / 0.1)'
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'scale(1.1)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent'
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--primary)' }}>
                  {letter}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
