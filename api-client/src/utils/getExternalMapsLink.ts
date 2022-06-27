import LocationModel from '../models/LocationModel'

const getExternalMapsLink = (
  location: LocationModel,
  platform: 'web' | 'android' | 'ios' | string
): string | null => {
  if (!location.location || !location.coordinates) {
    return null
  }
  const long = location.coordinates[0]
  const lat = location.coordinates[1]
  const android = `geo:${lat},${long}?q=${location.location}`

  switch (platform) {
    case 'web': {
      const baseUrl = `https://maps.google.com?q=`
      const isAndroid = /Android/i.test(navigator.userAgent)
      return isAndroid ? android : `${baseUrl}${location.location},${lat},${long}`
    }
    case 'android':
      return android
    case 'ios':
      return `maps:${lat},${long}?q=${location.location}`
    default:
      return null
  }
}

export default getExternalMapsLink
