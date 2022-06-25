import { LocationModel } from 'api-client'

export const getNavigationDeepLinks = (location: LocationModel<number>): string => {
  const baseUrl = `https://maps.google.com?q=`

  const long = location.coordinates[0]
  const lat = location.coordinates[1]

  const isAndroid = /Android/i.test(navigator.userAgent)

  if (isAndroid) {
    return `geo:${lat},${long}?q=${location.fullAddress}`
  }
  return `${baseUrl}${location.fullAddress},${lat},${long}`
}
