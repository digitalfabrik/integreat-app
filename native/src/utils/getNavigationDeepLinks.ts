import { Platform } from 'react-native'

/**
 * Depending on the platform this function returns the correct deeplink for navigation app
 * @param address: location address
 */
export const getNavigationDeepLinks = (address: string): string | undefined =>
  Platform.select({
    ios: `maps:0,0?q=${address}`,
    android: `geo:0,0?q=${address}`
  })
