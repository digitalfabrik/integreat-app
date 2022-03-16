import { useEffect, useState } from 'react'

import { LocationStateType, LocationType, UnavailableLocationState, UserLocationType } from 'api-client'

const locationStateOnError = (error: GeolocationPositionError): UnavailableLocationState => {
  const { code } = error
  switch (code) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return {
        status: 'unavailable',
        message: 'noPermission'
      }
    case GeolocationPositionError.POSITION_UNAVAILABLE:
      return {
        status: 'unavailable',
        message: 'notAvailable'
      }
    default:
      return {
        status: 'unavailable',
        message: 'timeout'
      }
  }
}

export const useUserLocation = (): UserLocationType => {
  const [userCoordinates, setUserCoordinates] = useState<LocationType | null>(null)
  const [locationState, setLocationState] = useState<LocationStateType>({
    status: 'unavailable',
    message: 'loading'
  })
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        // eslint-disable-next-line -- check needed for tests
        if (coords) {
          const { latitude, longitude } = coords
          setUserCoordinates([longitude, latitude])
          setLocationState({ status: 'ready', message: 'localized' })
        }
      },
      (error: GeolocationPositionError) => {
        setLocationState(locationStateOnError(error))
      },
      { timeout: 50000 }
    )
  }, [])
  return { locationState, userCoordinates }
}
