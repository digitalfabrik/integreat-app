import Geolocation, { GeolocationError, GeolocationResponse } from '@react-native-community/geolocation'
import { useCallback, useEffect, useState } from 'react'
import { openSettings, RESULTS } from 'react-native-permissions'
import SystemSetting from 'react-native-system-setting'

import { LocationStateType, LocationType, UnavailableLocationState } from 'api-client'

import { checkLocationPermission, requestLocationPermission } from '../utils/LocationPermissionManager'

const locationStateOnError = (error: GeolocationError): UnavailableLocationState => {
  if (error.code === error.PERMISSION_DENIED) {
    return {
      status: 'unavailable',
      message: 'noPermission'
    }
  }
  if (error.code === error.POSITION_UNAVAILABLE) {
    return {
      status: 'unavailable',
      message: 'notAvailable'
    }
  }
  return {
    status: 'unavailable',
    message: 'timeout'
  }
}

export type LocationInformationType = {
  location: LocationType | null
  locationState: LocationStateType
  requestAndDetermineLocation: () => Promise<void>
}

const useUserLocation = (useSettingsListener = false): LocationInformationType => {
  const [locationState, setLocationState] = useState<LocationStateType>({
    status: 'unavailable',
    message: 'loading'
  })
  const [location, setLocation] = useState<LocationType | null>(null)

  const determineLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      (position: GeolocationResponse) => {
        setLocation([position.coords.longitude, position.coords.latitude])
        setLocationState({ status: 'ready', message: 'localized' })
      },
      (error: GeolocationError) => {
        setLocationState(locationStateOnError(error))
      },
      {
        enableHighAccuracy: true,
        timeout: 50000,
        maximumAge: 3600000
      }
    )
  }, [])

  useEffect(() => {
    checkLocationPermission().then(locationPermissionStatus => {
      if (locationPermissionStatus === RESULTS.GRANTED) {
        setLocationState({
          message: 'loading',
          status: 'unavailable'
        })
        determineLocation()
      } else {
        setLocationState({
          status: 'unavailable',
          message: 'noPermission'
        })
      }
    })
  }, [determineLocation])

  const requestAndDetermineLocation = useCallback(async () => {
    setLocationState({
      message: 'loading',
      status: 'unavailable'
    })
    const locationPermissionStatus = await checkLocationPermission()

    if (locationPermissionStatus === RESULTS.GRANTED || (await requestLocationPermission()) === RESULTS.GRANTED) {
      determineLocation()
    } else {
      setLocationState({
        message: 'noPermission',
        status: 'unavailable'
      })
      if (locationPermissionStatus === RESULTS.BLOCKED) {
        await openSettings()
      }
    }
  }, [determineLocation])

  useEffect(() => {
    if (useSettingsListener) {
      const onLocationChanged = (enabled: boolean) => {
        if (enabled) {
          requestAndDetermineLocation()
        } else {
          setLocation(null)
          setLocationState({
            status: 'unavailable',
            message: 'notAvailable'
          })
        }
      }
      // updates the location state, whenever the user changes the location permission
      const listener = SystemSetting.addLocationListener(onLocationChanged)
      return () => {
        listener.then(listener => listener && SystemSetting.removeListener(listener))
      }
    }
    return () => undefined
  })

  const isReadyOrLoading = locationState.status === 'ready' || locationState.message === 'loading'

  return {
    locationState,
    location: isReadyOrLoading ? location : null,
    requestAndDetermineLocation
  }
}

export default useUserLocation
