import { useCallback } from 'react'

import { CityModel, createCitiesEndpoint, fromError, ReturnType, useLoadAsync } from 'api-client'

import { SnackbarType } from '../components/SnackbarContainer'
import dataContainer from '../utils/DefaultDataContainer'
import { determineApiUrl } from '../utils/helpers'
import useSnackbar from './useSnackbar'

const loadWithCache = async ({
  showSnackbar,
  forceUpdate = false,
}: {
  forceUpdate?: boolean
  showSnackbar: (snackbar: SnackbarType) => void
}): Promise<CityModel[] | null> => {
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

const useLoadCities = (): ReturnType<CityModel[]> => {
  const showSnackbar = useSnackbar()
  return useLoadAsync(useCallback(forceUpdate => loadWithCache({ showSnackbar, forceUpdate }), [showSnackbar]))
}

export default useLoadCities
