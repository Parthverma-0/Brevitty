import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Resets scroll to the top on route change (but preserves in-page hash links).
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
