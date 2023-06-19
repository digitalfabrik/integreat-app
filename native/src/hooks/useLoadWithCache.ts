import { DateTime } from 'luxon'
import { useCallback } from 'react'

import { Endpoint, fromError, ReturnType, useLoadAsync } from 'api-client'

import { SnackbarType } from '../components/SnackbarContainer'
import dataContainer from '../utils/DefaultDataContainer'
import { determineApiUrl } from '../utils/helpers'

type Load<T> = {
  cityCode: string
  languageCode: string
  createEndpoint: (baseUrl: string) => Endpoint<{ city: string; language: string }, T>
  isAvailable: (cityCode: string, languageCode: string) => Promise<boolean>
  getFromDataContainer: (cityCode: string, languageCode: string) => Promise<T>
  setToDataContainer: (cityCode: string, languageCode: string, data: T) => Promise<void>
  forceUpdate?: boolean
  showSnackbar: (snackbar: SnackbarType) => void
}

/**
 * Hook to load data either from the cache of the data container or from an endpoint if not yet available, refreshing, or too old.
 * Updates the cache after loading from the endpoint.
 * Shows a snackbar instead of returning an error if the data is available in the cache.
 */
const loadWithCache = async <T>({
  cityCode,
  languageCode,
  isAvailable,
  getFromDataContainer,
  setToDataContainer,
  createEndpoint,
  showSnackbar,
  forceUpdate = false,
}: Load<T>): Promise<T | null> => {
  const cachedData = (await isAvailable(cityCode, languageCode))
    ? await getFromDataContainer(cityCode, languageCode)
    : null

  const lastUpdate = await dataContainer.getLastUpdate(cityCode, languageCode)
  const shouldUpdate = forceUpdate || !lastUpdate || lastUpdate.toUTC().startOf('day') < DateTime.utc().startOf('day')

  if (!shouldUpdate && cachedData) {
    return cachedData
  }

  try {
    const payload = await createEndpoint(await determineApiUrl()).request({
      city: cityCode,
      language: languageCode,
    })
    if (payload.data) {
      await setToDataContainer(cityCode, languageCode, payload.data)
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

const useLoadWithCache = <T>(params: Load<T>): ReturnType<T> =>
  // Normally using params as dependency triggers infinite re-renders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLoadAsync(useCallback(forceUpdate => loadWithCache({ ...params, forceUpdate }), [JSON.stringify(params)]))

export default useLoadWithCache
