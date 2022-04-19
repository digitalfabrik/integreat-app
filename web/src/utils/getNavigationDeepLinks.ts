import { LocationModel } from 'api-client'

export const getNavigationDeepLinks = (location: LocationModel, fallback: string): string => {
  if (!location.location || !location.coordinates) {
    return fallback
  }

  const long = location.coordinates[0]
  const lat = location.coordinates[1]

  const isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent)
  const isAndroid = /Android/i.test(navigator.userAgent)

  if (isIos) {
    return `maps:${lat},${long}?q=${location.location}`
  }
  if (isAndroid) {
    return `geo:${lat},${long}?q=${location.location}`
  }
  return fallback
}
