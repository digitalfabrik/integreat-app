import { Platform } from 'react-native'

import { LocationModel } from 'api-client/src'

export const getNavigationDeepLinks = (location: LocationModel<number>): string => {
  const x = location.coordinates[0]
  const y = location.coordinates[1]

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return Platform.select({
    ios: `maps:${y},${x}?q=${location.fullAddress}`,
    android: `geo:${y},${x}?q=${location.fullAddress}`
  })!
}
