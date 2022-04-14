import { LocationModel } from 'api-client'

export const getNavigationDeepLinks = (location: LocationModel, fallback: string): string => {
  if (!location.location || !location.coordinates) {
    return fallback
  }

  const x = location.coordinates[0]
  const y = location.coordinates[1]

  const isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent)
  const isAndroid = /Android/i.test(navigator.userAgent)

  if (isIos) {
    return `maps:${y},${x}?q=${location.location}`
  }
  if (isAndroid) {
    return `geo:${y},${x}?q=${location.location}`
  }
  return fallback
}
