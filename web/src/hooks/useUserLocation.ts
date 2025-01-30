import { useCallback } from 'react'

import { UnavailableLocationState, UserLocationType } from 'shared'
import { useLoadAsync } from 'shared/api'

const currentPositionTimeout = 50_000

const locationStateOnError = (error: GeolocationPositionError): UnavailableLocationState => {
  const { code } = error
  switch (code) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return {
        status: 'unavailable',
        message: 'noPermission',
        coordinates: undefined,
      }
    case GeolocationPositionError.POSITION_UNAVAILABLE:
      return {
        status: 'unavailable',
        message: 'notAvailable',
        coordinates: undefined,
      }
    default:
      return {
        status: 'unavailable',
        message: 'timeout',
        coordinates: undefined,
      }
  }
}

export const getUserLocation = async (): Promise<UserLocationType> =>
  new Promise(resolve => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords
        resolve({ coordinates: [longitude, latitude], status: 'ready', message: 'ready' })
      },
      (error: GeolocationPositionError) => {
        resolve(locationStateOnError(error))
      },
      { timeout: currentPositionTimeout },
    )
  })

type useUserLocationReturn = {
  data: UserLocationType | null
  refresh: () => void
  error: Error | null
  loading: boolean
}

const useUserLocation = (): useUserLocationReturn => {
  const { data, refresh, error, loading } = useLoadAsync(useCallback(async () => getUserLocation(), []))

  return {
    data,
    refresh,
    error,
    loading,
  }
}

export default useUserLocation
