import { LocationModel } from 'api-client'

export const getNavigationDeepLinks = (location: LocationModel, title: string): string => {
  const baseUrl = `https://maps.google.com?q=`
  // TODO remove check after IGAPP-985
  if (!location.location || !location.coordinates) {
    return baseUrl + title
  }

  const long = location.coordinates[0]
  const lat = location.coordinates[1]

  const isAndroid = /Android/i.test(navigator.userAgent)

  if (isAndroid) {
    return `geo:${lat},${long}?q=${location.location}`
  }
  return `${baseUrl}${location.location},${lat},${long}`
}
