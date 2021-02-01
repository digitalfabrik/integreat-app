// @flow

import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions'
import { Platform } from 'react-native'
import buildConfig from './constants/buildConfig'

export const checkLocationPermission = async (): Promise<RESULTS> => {
  if (buildConfig().featureFlags.fixedCity) {
    throw Error('Can not check location permission when city is fixed')
  }
  return check(Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
  )
}

export const requestLocationPermission = async (): Promise<void> => {
  if (buildConfig().featureFlags.fixedCity) {
    throw Error('Can not request location permission when city is fixed')
  }
  await request(Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
  )
}
