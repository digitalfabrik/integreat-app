import Geolocation, { GeolocationError } from '@react-native-community/geolocation'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import {
  check,
  checkMultiple,
  openSettings,
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from 'react-native-permissions'

import { LocationStateType, UnavailableLocationState } from 'shared'

import { log, reportError } from '../utils/sentry'
import useAppStateListener from './useAppStateListener'
import useSnackbar from './useSnackbar'

const locationStateOnError = (error: GeolocationError): UnavailableLocationState => {
  const message = error.code === error.PERMISSION_DENIED ? 'noPermission' : 'timeout'
  return {
    status: 'unavailable',
    message: error.code === error.POSITION_UNAVAILABLE ? 'notAvailable' : message,
    coordinates: undefined,
  }
}

const getUserLocation = async (): Promise<LocationStateType> =>
  new Promise(resolve => {
    Geolocation.getCurrentPosition(
      position =>
        resolve({
          status: 'ready',
          message: 'ready',
          coordinates: [position.coords.longitude, position.coords.latitude],
        }),
      error => resolve(locationStateOnError(error)),
      { timeout: 30000 },
    )
  })

const locationPermissionIOS = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
const fineLocationPermissionAndroid = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
const coarseLocationPermissionAndroid = PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION

const getLocationPermissionStatus = async (requestPermission: boolean) => {
  if (Platform.OS === 'ios') {
    const checkOrRequest = requestPermission ? request : check
    return checkOrRequest(locationPermissionIOS)
  }
  const permissions = [fineLocationPermissionAndroid, coarseLocationPermissionAndroid]
  const checkOrRequest = requestPermission ? requestMultiple : checkMultiple
  const statuses = await checkOrRequest(permissions)
  const finePermissionStatus = statuses[fineLocationPermissionAndroid]

  if (finePermissionStatus === RESULTS.GRANTED || finePermissionStatus === RESULTS.LIMITED) {
    return finePermissionStatus
  }
  return statuses[coarseLocationPermissionAndroid]
}

type UseUserLocationProps = {
  requestPermissionInitially: boolean
}

type RequestPermissionAndLocationOptions = {
  showSnackbarIfBlocked?: boolean
  requestPermission?: boolean
}

type UseUserLocationReturn = LocationStateType & {
  refreshPermissionAndLocation: (options?: RequestPermissionAndLocationOptions) => Promise<LocationStateType | null>
}

const initialState: LocationStateType = { status: 'loading', message: 'loading', coordinates: undefined }

const useUserLocation = ({ requestPermissionInitially }: UseUserLocationProps): UseUserLocationReturn => {
  const [locationState, setLocationState] = useState<LocationStateType>(initialState)
  const showSnackbar = useSnackbar()
  const { t } = useTranslation()

  const refreshPermissionAndLocation = useCallback(
    async ({
      showSnackbarIfBlocked = true,
      requestPermission = true,
    }: RequestPermissionAndLocationOptions = {}): Promise<LocationStateType | null> => {
      setLocationState(initialState)

      const locationPermissionStatus = await getLocationPermissionStatus(requestPermission)

      if (requestPermission) {
        log(`Location permission status: ${locationPermissionStatus}`)
      }

      if (locationPermissionStatus === RESULTS.GRANTED) {
        const location = await getUserLocation()
        setLocationState(location)
        return location
      }

      setLocationState({ message: 'noPermission', status: 'unavailable', coordinates: undefined })

      if (requestPermission && showSnackbarIfBlocked && locationPermissionStatus === RESULTS.BLOCKED) {
        showSnackbar({
          text: t('landing:noPermission'),
          action: { label: t('layout:settings'), onPress: openSettings },
        })
      }
      return null
    },
    [showSnackbar, t],
  )

  useEffect(() => {
    refreshPermissionAndLocation({ requestPermission: requestPermissionInitially, showSnackbarIfBlocked: false }).catch(
      reportError,
    )
  }, [refreshPermissionAndLocation, requestPermissionInitially])

  // Re-check permissions when returning from settings
  useAppStateListener(appState => {
    if (appState === 'active') {
      refreshPermissionAndLocation({ requestPermission: false, showSnackbarIfBlocked: false }).catch(reportError)
    }
  })

  return {
    ...locationState,
    refreshPermissionAndLocation,
  }
}

export default useUserLocation
