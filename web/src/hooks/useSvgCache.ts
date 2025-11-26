import { useState, useEffect } from 'react'

const svgCache = new Map<string, string>()

export const useSvgCache = (src: string): string | null => {
  const [cachedSvg, setCachedSvg] = useState<string | null>(() => svgCache.get(src) || null)

  useEffect(() => {
    if (!src) return
    
    // If we already have it in cache, use it
    if (svgCache.has(src)) {
      setCachedSvg(svgCache.get(src) || null)
      return
    }

    // Otherwise, fetch it
    let isMounted = true
    
    const fetchSvg = async () => {
      try {
        const response = await fetch(src)
        if (response.ok) {
          const svgText = await response.text()
          if (isMounted) {
            svgCache.set(src, svgText)
            setCachedSvg(svgText)
          }
        }
      } catch (error) {
        console.error(Error loading SVG: ${src}, error)
      }
    }

    fetchSvg()

    return () => {
      isMounted = false
    }
  }, [src])

  return cachedSvg
}
