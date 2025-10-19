"use client"

import { Instagram, Phone, Send } from "lucide-react"
import { useEffect, useState } from "react"

interface ApiSettings {
  instagram?: string
  telegram?: string
  phone?: string
}

export default function AppFooter() {
  const [settings, setSettings] = useState<ApiSettings>({})

  useEffect(() => {
    // Listen for settings updates from restaurant-menu
    const handleSettingsUpdate = (event: CustomEvent) => {
      setSettings(event.detail)
    }

    window.addEventListener("settings-updated" as any, handleSettingsUpdate as EventListener)

    // Check localStorage for settings on mount
    const savedSettings = localStorage.getItem("restaurant-settings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (e) {
        console.error("Failed to parse saved settings:", e)
      }
    }

    return () => {
      window.removeEventListener("settings-updated" as any, handleSettingsUpdate as EventListener)
    }
  }, [])

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, "")

    // Check if it's a Uzbekistan number starting with 998
    if (digits.startsWith("998") && digits.length === 12) {
      return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`
    }

    // For numbers starting with +998
    if (phone.startsWith("+998")) {
      const cleanDigits = phone.replace(/\D/g, "")
      if (cleanDigits.length === 12) {
        return `+${cleanDigits.slice(0, 3)} ${cleanDigits.slice(3, 5)} ${cleanDigits.slice(5, 8)} ${cleanDigits.slice(8, 10)} ${cleanDigits.slice(10, 12)}`
      }
    }

    // Default formatting for other numbers
    if (digits.length >= 10) {
      return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10)}`
    }

    return phone // Return original if can't format
  }

  const renderContactLinks = () => {
    const instagramLink = settings.instagram ? (
      <a
        key="instagram"
        href={settings.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition-all duration-300 hover:scale-105 group"
        aria-label="Open Instagram"
      >
        <div className="p-1.5 md:p-2 rounded-full bg-primary-foreground/20 group-hover:bg-primary-foreground/40 transition-colors">
          <Instagram className="w-4 h-4 md:w-6 md:h-6" />
        </div>
        <span className="text-sm md:text-lg font-medium text-white dark:text-foreground">Instagram</span>
      </a>
    ) : null

    const telegramLink = settings.telegram ? (
      <a
        key="telegram"
        href={settings.telegram}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition-all duration-300 hover:scale-105 group"
        aria-label="Open Telegram"
      >
        <div className="p-1.5 md:p-2 rounded-full bg-primary-foreground/20 group-hover:bg-primary-foreground/40 transition-colors">
          <Send className="w-4 h-4 md:w-6 md:h-6" />
        </div>
        <span className="text-sm md:text-lg font-medium text-white dark:text-foreground">Telegram</span>
      </a>
    ) : null

    const phoneLink = settings.phone ? (
      <a
        key="phone"
        href={`tel:${settings.phone}`}
        className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition-all duration-300 hover:scale-105 group"
        aria-label={`Call ${formatPhoneNumber(settings.phone)}`}
      >
        <div className="p-1.5 md:p-2 rounded-full bg-primary-foreground/20 group-hover:bg-primary-foreground/40 transition-colors">
          <Phone className="w-4 h-4 md:w-6 md:h-6" />
        </div>
        <span className="text-sm md:text-lg font-medium text-white dark:text-foreground">
          {formatPhoneNumber(settings.phone)}
        </span>
      </a>
    ) : null

    const availableLinks = [instagramLink, telegramLink, phoneLink].filter(Boolean)

    // Return null if no links available (no default fallback)
    if (availableLinks.length === 0) {
      return null
    }

    // Layout: first 2 items in one row, third item in new row
    if (availableLinks.length === 1) {
      return availableLinks[0]
    } else if (availableLinks.length === 2) {
      return <div className="flex items-center justify-center gap-4 md:gap-8">{availableLinks}</div>
    } else {
      return (
        <div className="flex flex-col items-center gap-2 md:gap-4">
          <div className="flex items-center justify-center gap-4 md:gap-8">{availableLinks.slice(0, 2)}</div>
          <div className="flex justify-center">{availableLinks[2]}</div>
        </div>
      )
    }
  }
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-secondary text-primary-foreground py-2 md:py-6 px-4 shadow-2xl">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-accent" />

      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center">{renderContactLinks()}</div>
    </footer>
  )
}
