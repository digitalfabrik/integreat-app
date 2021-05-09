import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions'
import { Platform } from 'react-native'
import buildConfig from './constants/buildConfig'
export const checkLocationPermission = async (): Promise<RESULTS> => {
  if (buildConfig().featureFlags.fixedCity) {
    return RESULTS.UNAVAILABLE
  }

  return check(Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
}
export const requestLocationPermission = async (): Promise<RESULTS> => {
  if (buildConfig().featureFlags.fixedCity) {
    console.debug('Location permission disabled, no permissions requested.')
    return
  }

  return await request(
    Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
  )
}
