import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import AppHeader from './AppHeader'
import AppFooter from './AppFooter'

export default function Layout() {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'x' || e.key === 'a' || e.key === 's' || e.key === 'p')) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I')
      ) {
        e.preventDefault()
        return false
      }
    }
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      <AppHeader />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <AppFooter />
    </div>
  )
}
