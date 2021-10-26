import { Platform } from 'react-native'
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions'
import type { PermissionStatus } from 'react-native-permissions'

import buildConfig from '../constants/buildConfig'
import { log } from './helpers'

export const checkLocationPermission = async (): Promise<PermissionStatus> => {
  if (buildConfig().featureFlags.fixedCity) {
    return RESULTS.UNAVAILABLE
  }

  return check(Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
}
export const requestLocationPermission = async (): Promise<PermissionStatus> => {
  if (buildConfig().featureFlags.fixedCity) {
    log('Location permission disabled, no permissions requested.')
    return 'unavailable'
  }

  return request(
    Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
  )
}
