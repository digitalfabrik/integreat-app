import { DateTime } from 'luxon'
import { useCallback } from 'react'

import { Endpoint, fromError, ReturnType, useLoadAsync } from 'shared/api'

import { SnackbarType } from '../components/SnackbarContainer'
import dataContainer from '../utils/DefaultDataContainer'
import { determineApiUrl } from '../utils/helpers'

type Load<T extends object> = {
  regionCode: string
  languageCode: string
  createEndpoint: (baseUrl: string) => Endpoint<{ region: string; language: string }, T>
  isAvailable: (regionCode: string, languageCode: string) => Promise<boolean>
  getFromDataContainer: (regionCode: string, languageCode: string) => Promise<T>
  setToDataContainer: (regionCode: string, languageCode: string, data: T) => Promise<void>
  forceUpdate?: boolean
  showSnackbar: (snackbar: SnackbarType) => void
}

/**
 * Hook to load data either from the cache of the data container or from an endpoint if not yet available, refreshing, or too old.
 * Updates the cache after loading from the endpoint.
 * Shows a snackbar instead of returning an error if the data is available in the cache.
 */
const loadWithCache = async <T extends object>({
  regionCode,
  languageCode,
  isAvailable,
  getFromDataContainer,
  setToDataContainer,
  createEndpoint,
  showSnackbar,
  forceUpdate = false,
}: Load<T>): Promise<T | null> => {
  const cachedData = (await isAvailable(regionCode, languageCode))
    ? await getFromDataContainer(regionCode, languageCode)
    : null

  const lastUpdate = await dataContainer.getLastUpdate(regionCode, languageCode)
  const shouldUpdate = forceUpdate || !lastUpdate || lastUpdate < DateTime.utc().startOf('day')

  if (!shouldUpdate && cachedData) {
    return cachedData
  }

  try {
    const payload = await createEndpoint(await determineApiUrl()).request({
      region: regionCode,
      language: languageCode,
    })
    if (payload.data !== null) {
      await setToDataContainer(regionCode, languageCode, payload.data)
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

const useLoadWithCache = <T extends object>(params: Load<T>): ReturnType<T> =>
  useLoadAsync<T>(
    useCallback(
      forceUpdate => loadWithCache<T>({ ...params, forceUpdate: params.forceUpdate || forceUpdate }),
      // Normally using params as dependency triggers infinite re-renders
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [JSON.stringify(params)],
    ),
  )

export default useLoadWithCache
