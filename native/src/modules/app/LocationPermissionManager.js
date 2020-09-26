// @flow

import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions'
import { Platform } from 'react-native'

export const checkLocationPermission = async (): Promise<RESULTS> => {
  return check(Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
  )
}

export const requestLocationPermission = async (): Promise<void> => {
  await request(Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
  )
}
