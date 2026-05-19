import { useCallback } from 'react'

import { LocationType, UnavailableLocationState, UserLocationType } from 'shared'
import { ReturnType, useLoadAsync } from 'shared/api'

const currentPositionTimeout = 50_000

const userLocationMessage = (error: GeolocationPositionError): UnavailableLocationState['message'] => {
  const { code } = error
  switch (code) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return 'noPermission'
    case GeolocationPositionError.POSITION_UNAVAILABLE:
      return 'notAvailable'
    default:
      return 'timeout'
  }
}

export const getUserLocation = async (): Promise<UserLocationType> =>
  new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords
        resolve({ userLocation: [longitude, latitude], status: 'ready', message: 'ready' })
      },
      (error: GeolocationPositionError) => {
        resolve({ userLocation: null, status: 'unavailable', message: userLocationMessage(error) })
      },
      { timeout: currentPositionTimeout },
    )
  })

const useUserLocation = (): ReturnType<LocationType> =>
  useLoadAsync(
    useCallback(async () => {
      const userLocation = await getUserLocation()
      return userLocation.status === 'ready' ? userLocation.userLocation : null
    }, []),
  )

export default useUserLocation
