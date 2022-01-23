import { Platform } from 'react-native'

import { LocationModel } from 'api-client/src'

export const getNavigationDeepLinks = (location: LocationModel): string | null => {
  if (!location.location || !location.coordinates) {
    return null
  }

  const x = location.coordinates[0]
  const y = location.coordinates[1]

  return Platform.select({
    ios: `maps:${y},${x}?q=${location.location}`,
    android: `geo:${y},${x}?q=${location.location}`
  })!
}
