import Geolocation, { GeolocationError, GeolocationResponse } from '@react-native-community/geolocation'
import { useCallback, useEffect, useState } from 'react'
import { openSettings, RESULTS } from 'react-native-permissions'
import SystemSetting from 'react-native-system-setting'

import { LocationStateType, UnavailableLocationState } from 'api-client'

import { checkLocationPermission, requestLocationPermission } from '../utils/LocationPermissionManager'

const locationStateOnError = (error: GeolocationError): UnavailableLocationState => {
  if (error.code === error.PERMISSION_DENIED) {
    return {
      status: 'unavailable',
      message: 'noPermission',
      coordinates: null
    }
  }
  if (error.code === error.POSITION_UNAVAILABLE) {
    return {
      status: 'unavailable',
      message: 'notAvailable',
      coordinates: null
    }
  }
  return {
    status: 'unavailable',
    message: 'timeout',
    coordinates: null
  }
}

export type LocationInformationType = LocationStateType & {
  requestAndDetermineLocation: () => Promise<void>
}

const useUserLocation = (useSettingsListener = false): LocationInformationType => {
  const [locationState, setLocationState] = useState<LocationStateType>({
    status: 'loading',
    message: 'loading',
    coordinates: null
  })

  const determineLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      (position: GeolocationResponse) => {
        setLocationState({ status: 'ready', coordinates: [position.coords.longitude, position.coords.latitude] })
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
        setLocationState(state => ({
          status: 'loading',
          message: 'loading',
          coordinates: state.coordinates
        }))
        determineLocation()
      } else {
        setLocationState({
          status: 'unavailable',
          message: 'noPermission',
          coordinates: null
        })
      }
    })
  }, [determineLocation])

  const requestAndDetermineLocation = useCallback(async () => {
    setLocationState(state => ({
      status: 'loading',
      message: 'loading',
      coordinates: state.coordinates
    }))
    const locationPermissionStatus = await checkLocationPermission()

    if (locationPermissionStatus === RESULTS.GRANTED || (await requestLocationPermission()) === RESULTS.GRANTED) {
      determineLocation()
    } else {
      setLocationState({
        message: 'noPermission',
        status: 'unavailable',
        coordinates: null
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
          setLocationState({
            status: 'unavailable',
            message: 'notAvailable',
            coordinates: null
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

  return {
    ...locationState,
    requestAndDetermineLocation
  }
}

export default useUserLocation
