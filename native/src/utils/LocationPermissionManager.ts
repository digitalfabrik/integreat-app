import { Platform } from 'react-native'
import { check, PERMISSIONS, request } from 'react-native-permissions'
import type { PermissionStatus } from 'react-native-permissions'

export const checkLocationPermission = async (): Promise<PermissionStatus> =>
  check(Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)

export const requestLocationPermission = async (): Promise<PermissionStatus> =>
  request(Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
