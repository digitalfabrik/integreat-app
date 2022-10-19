import { useCallback } from 'react'

import { CityModel, createCitiesEndpoint, ReturnType, useLoadAsync } from 'api-client'

import { dataContainer } from '../utils/DefaultDataContainer'
import { determineApiUrl } from '../utils/helpers'

const useLoadCities = (): ReturnType<CityModel[]> => {
  const load = useCallback(async () => {
    if (await dataContainer.citiesAvailable()) {
      return dataContainer.getCities()
    }

    const payload = await createCitiesEndpoint(await determineApiUrl()).request()
    if (payload.data) {
      await dataContainer.setCities(payload.data)
    }
    return payload.data ?? null
  }, [])

  return useLoadAsync(load)
}

export default useLoadCities
