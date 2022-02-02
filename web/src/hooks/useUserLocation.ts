import { useEffect, useState } from 'react'

import { LocationType } from 'api-client'

export const useUserLocation = (): LocationType | null => {
  const [userLocation, setUserLocation] = useState<LocationType | null>(null)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const { latitude, longitude } = coords
      setUserLocation([latitude, longitude])
    })
  }, [])
  return userLocation
}
