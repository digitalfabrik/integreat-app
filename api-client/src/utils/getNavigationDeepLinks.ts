import LocationModel from '../models/LocationModel'

const getNavigationDeepLinks = (
  location: LocationModel,
  platform: 'web' | 'android' | 'ios' | string
): string | null => {
  if (!location.location || !location.coordinates) {
    return null
  }
  const long = location.coordinates[0]
  const lat = location.coordinates[1]

  switch (platform) {
    case 'web': {
      const baseUrl = `https://maps.google.com?q=`
      return `${baseUrl}${location.location},${lat},${long}`
    }
    case 'android':
      return `geo:${lat},${long}?q=${location.location}`
    case 'ios':
      return `maps:${lat},${long}?q=${location.location}`
    default:
      return null
  }
}

export default getNavigationDeepLinks
