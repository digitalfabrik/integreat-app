import { useCallback } from 'react'

import { CityModel, createCitiesEndpoint, fromError, ReturnType, useLoadAsync } from 'api-client'

import { SnackbarType } from '../components/SnackbarContainer'
import dataContainer from '../utils/DefaultDataContainer'
import { determineApiUrl } from '../utils/helpers'

type Params = {
  forceUpdate?: boolean
  showSnackbar: (snackbar: SnackbarType) => void
}

const loadWithCache = async ({ showSnackbar, forceUpdate = false }: Params): Promise<CityModel[] | null> => {
  const cachedData = (await dataContainer.citiesAvailable()) ? await dataContainer.getCities() : null

  if (!forceUpdate && cachedData) {
    return cachedData
  }

  try {
    const payload = await createCitiesEndpoint(await determineApiUrl()).request()
    if (payload.data) {
      await dataContainer.setCities(payload.data)
    }
    return payload.data ?? cachedData
  } catch (e) {
    if (!cachedData) {
      throw e
    }
    if (forceUpdate) {
      showSnackbar({ text: fromError(e) })
    }
  }
  return cachedData
}

const useLoadCities = (params: Params): ReturnType<CityModel[]> =>
  // Normally using params as dependency triggers infinite re-renders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLoadAsync(useCallback(forceUpdate => loadWithCache({ ...params, forceUpdate }), []))

export default useLoadCities
