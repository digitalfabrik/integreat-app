import { UnavailableLocationState, UserLocationType } from 'api-client'

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

const getUserLocation = async (): Promise<UserLocationType> =>
  new Promise(resolve =>
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords
        resolve({ coordinates: [longitude, latitude], status: 'ready' })
      },
      (error: GeolocationPositionError) => {
        resolve(locationStateOnError(error))
      },
      { timeout: 50000 }
    )
  )

export default getUserLocation
