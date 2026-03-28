import { useEffect, useState } from 'react'
import { Phone, Send } from 'lucide-react'

interface ApiSettings {
  instagram?: string
  telegram?: string
  phone?: string
}

// Instagram SVG icon (inline)
function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('998') && digits.length === 12) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`
  }
  if (digits.length >= 10) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`
  }
  return phone
}

export default function AppFooter() {
  const [settings, setSettings] = useState<ApiSettings>({})

  useEffect(() => {
    const handleSettingsUpdate = (event: Event) => {
      setSettings((event as CustomEvent<ApiSettings>).detail)
    }
    window.addEventListener('settings-updated', handleSettingsUpdate)
    const saved = localStorage.getItem('restaurant-settings')
    if (saved) {
      try { setSettings(JSON.parse(saved)) } catch { /* ignore */ }
    }
    return () => window.removeEventListener('settings-updated', handleSettingsUpdate)
  }, [])

  const linkStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: 'white',
    transition: 'opacity 0.3s',
    fontWeight: 500,
    fontSize: '1rem',
  }

  const iconWrap: React.CSSProperties = {
    padding: '0.4rem',
    borderRadius: '9999px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  const links: React.ReactNode[] = []

  if (settings.instagram)
    links.push(
      <a key="ig" href={settings.instagram} target="_blank" rel="noopener noreferrer" style={linkStyle}>
        <div style={iconWrap}><InstagramIcon size={20} /></div>
        <span>Instagram</span>
      </a>
    )
  if (settings.telegram)
    links.push(
      <a key="tg" href={settings.telegram} target="_blank" rel="noopener noreferrer" style={linkStyle}>
        <div style={iconWrap}><Send size={20} /></div>
        <span>Telegram</span>
      </a>
    )
  if (settings.phone)
    links.push(
      <a key="ph" href={`tel:${settings.phone}`} style={linkStyle}>
        <div style={iconWrap}><Phone size={20} /></div>
        <span>{formatPhoneNumber(settings.phone)}</span>
      </a>
    )

  if (links.length === 0) return null

  const renderLinks = () => {
    if (links.length === 1) return links[0]
    if (links.length === 2)
      return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>{links}</div>
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>{links.slice(0, 2)}</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>{links[2]}</div>
      </div>
    )
  }

  return (
    <footer style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
      color: 'var(--primary-foreground)',
      padding: '0.5rem 1rem',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.3)',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--accent), var(--primary), var(--accent))' }} />
      <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {renderLinks()}
      </div>
    </footer>
  )
}
