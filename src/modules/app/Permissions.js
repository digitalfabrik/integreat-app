// @flow

import { check, PERMISSIONS, request, checkNotifications, RESULTS } from 'react-native-permissions'
import { Platform } from 'react-native'
import * as NotificationsManager from '../../modules/notifications/NotificationsManager'

export const locationPermissionStatus = async (): RESULTS => {
  return check(Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
  )
}

export const pushNotificationPermissionStatus = async (): RESULTS => {
  const { status } = await checkNotifications()
  return status
}

export const requestLocationPermission = async (): RESULTS => {
  return request(Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
  )
}

export const requestPushNotificationPermission = async (): RESULTS => {
  return NotificationsManager.requestPushNotificationPermission()
}
