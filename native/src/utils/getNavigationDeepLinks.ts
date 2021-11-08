import type { Position } from 'geojson'
import { Platform } from 'react-native'

/**
 * Depending on the platform this function returns the correct deeplink for navigation app
 * @param address{string}: location address
 * @param coordinates{number[]}: latitude,longitude
 */
export const getNavigationDeepLinks = (address: string, coordinates: Position): string =>
  Platform.select({
    ios: `maps:${coordinates[1]},${coordinates[0]}?q=${address}`,
    android: `geo:${coordinates[1]},${coordinates[0]}?q=${address}`
  })!
