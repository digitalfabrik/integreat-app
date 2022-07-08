import LocationModel from '../models/LocationModel'

const getExternalMapsLink = (location: LocationModel<number>, platform: 'web' | 'android' | 'ios' | string): string => {
  const long = location.coordinates[0]
  const lat = location.coordinates[1]

  switch (platform) {
    case 'web':
      return `https://maps.google.com?q=${location.fullAddress},${lat},${long}`
    case 'android':
      return `geo:${lat},${long}?q=${location.fullAddress}`
    case 'ios':
      return `maps:${lat},${long}?q=${location.fullAddress}`
    default:
      throw new Error(`Platform ${platform} is not supported!`)
  }
}

export default getExternalMapsLink
