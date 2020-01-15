// @flow

import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions'
import { Platform } from 'react-native'

export const locationPermissionStatus = async (): RESULTS => {
  return check(Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
  )
}

export const pushNotificationPermissionStatus = async (): RESULTS => {
  // TODO NATIVE-399 Really check for push notification permissions
  return RESULTS.DENIED
}

export const requestLocationPermission = async (): RESULTS => {
  return request(Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
  )
}

export const requestPushNotificationPermission = async (): RESULTS => {
  // TODO NATIVE-399 Really request push notification permissions
}
