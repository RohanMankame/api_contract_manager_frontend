// src/hooks/useTheme.js
import { useState, useEffect } from 'react'

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first (with SSR guard and error handling)
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('theme-mode')
        if (saved) return saved === 'dark'
        
        return window.matchMedia('(prefers-color-scheme: dark)').matches
      } catch (e) {
        // Fallback if localStorage is disabled
        return window.matchMedia('(prefers-color-scheme: dark)').matches
      }
    }
    
    // SSR fallback
    return false
  })
  useEffect(() => {
    // Update DOM
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
    
    // Save preference
    try {
      localStorage.setItem('theme-mode', isDarkMode ? 'dark' : 'light')
    } catch (e) {
      console.warn('Unable to persist theme preference:', e)
    }
  }, [isDarkMode])
  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  return { isDarkMode, toggleTheme }
}