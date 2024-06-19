import Geolocation, { GeolocationError } from '@react-native-community/geolocation'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'
import { check, openSettings, PERMISSIONS, request, RESULTS } from 'react-native-permissions'

import { LocationStateType, UnavailableLocationState } from 'shared'

import { log, reportError } from '../utils/sentry'
import useSnackbar from './useSnackbar'

const locationPermission =
  Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION

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

type UseUserLocationProps = {
  requestPermissionInitially: boolean
}

type RequestPermissionAndLocationOptions = {
  showSnackbarIfBlocked?: boolean
  requestPermission?: boolean
}

type UseUserLocationReturn = LocationStateType & {
  refreshPermissionAndLocation: (options?: RequestPermissionAndLocationOptions) => Promise<void>
}

const initialState: LocationStateType = { status: 'loading', message: 'loading', coordinates: undefined }

const useUserLocation = ({ requestPermissionInitially }: UseUserLocationProps): UseUserLocationReturn => {
  const [locationState, setLocationState] = useState<LocationStateType>(initialState)
  const showSnackbar = useSnackbar()
  const { t } = useTranslation()

  const refreshPermissionAndLocation = useCallback(
    async ({ showSnackbarIfBlocked = true, requestPermission = true }: RequestPermissionAndLocationOptions = {}) => {
      setLocationState(initialState)

      const locationPermissionStatus = requestPermission
        ? await request(locationPermission)
        : await check(locationPermission)

      if (requestPermission) {
        log(`Location permission status: ${locationPermissionStatus}`)
      }

      if (locationPermissionStatus === RESULTS.GRANTED) {
        setLocationState(await getUserLocation())
      } else {
        setLocationState({ message: 'noPermission', status: 'unavailable', coordinates: undefined })

        if (requestPermission && showSnackbarIfBlocked && locationPermissionStatus === RESULTS.BLOCKED) {
          showSnackbar({
            text: t('landing:noPermission'),
            positiveAction: { label: t('layout:settings'), onPress: openSettings },
          })
        }
      }
    },
    [showSnackbar, t],
  )

  useEffect(() => {
    refreshPermissionAndLocation({
      requestPermission: requestPermissionInitially,
      showSnackbarIfBlocked: false,
    }).catch(reportError)
  }, [refreshPermissionAndLocation, requestPermissionInitially])

  return {
    ...locationState,
    refreshPermissionAndLocation,
  }
}

export default useUserLocation
