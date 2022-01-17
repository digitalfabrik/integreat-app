import { Platform } from 'react-native'

import { LocationModel } from 'api-client/src'

/**
 * Depending on the platform this function returns the correct deeplink for navigation app
 * @param address{string}: location address
 * @param location{number[]}: latitude,longitude
 */
export const getNavigationDeepLinks = (address: string, location: LocationModel): string | undefined => {
  if (!location.location && !location.coordinates) {
    return null
  }

  const x = location.coordinates[0]
  const y = location.coordinates[1]

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return Platform.select({
    ios: `maps:${y},${x}?q=${address}`,
    android: `geo:${y},${x}?q=${address}`
  })!
}
