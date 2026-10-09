import { TFunction } from 'i18next'
import { DateTime } from 'luxon'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { Endpoint, fromError, ReturnType, useLoadAsync } from 'shared/api'

import { getErrorMessage } from '../components/Failure'
import { SnackbarType } from '../components/SnackbarContainer'
import dataContainer from '../utils/DefaultDataContainer'
import { determineApiUrl } from '../utils/helpers'

type RegionContentEndpoint<T extends object> = Endpoint<{ region: string; language: string }, T>

type StoreProps<T extends object> = {
  regionCode: string
  languageCode: string
  setToDataContainer: (regionCode: string, languageCode: string, data: T) => Promise<void>
}

type LoadProps<T extends object> = StoreProps<T> & {
  createEndpoint: (baseUrl: string) => RegionContentEndpoint<T>
  isAvailable: (regionCode: string, languageCode: string) => Promise<boolean>
  getFromDataContainer: (regionCode: string, languageCode: string) => Promise<T>
  forceUpdate?: boolean
  showSnackbar: (snackbar: SnackbarType) => void
  t: TFunction
}

type RequestEntry = {
  requestedAt: DateTime
  pending: Promise<unknown> | null
}

// Requests of this session shared between all hook instances to avoid loading the same data multiple times.
// Necessary since the last update is only set once all region content is loaded.
const requests = new Map<string, RequestEntry>()

const isOutdated = (date: DateTime | null | undefined): boolean => !date || date < DateTime.utc().startOf('day')

const requestAndStore = async <T extends object>(
  endpoint: RegionContentEndpoint<T>,
  { regionCode, languageCode, setToDataContainer }: StoreProps<T>,
): Promise<T | null> => {
  const payload = await endpoint.request({ region: regionCode, language: languageCode })
  if (payload.data !== null) {
    await setToDataContainer(regionCode, languageCode, payload.data)
  }
  return payload.data
}

const shareRequest = async <T extends object>(key: string, pending: Promise<T | null>): Promise<T | null> => {
  const requestedAt = DateTime.utc()
  requests.set(key, { requestedAt, pending })
  try {
    const data = await pending
    if (data !== null) {
      requests.set(key, { requestedAt, pending: null })
    } else {
      requests.delete(key)
    }
    return data
  } catch (e) {
    requests.delete(key)
    throw e
  }
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
  t,
}: LoadProps<T>): Promise<T | null> => {
  const cachedData = (await isAvailable(regionCode, languageCode))
    ? await getFromDataContainer(regionCode, languageCode)
    : null

  const apiUrl = await determineApiUrl()
  const endpoint = createEndpoint(apiUrl)
  const key = [endpoint.stateName, apiUrl, regionCode, languageCode].join('/')

  const lastUpdate = await dataContainer.getLastUpdate(regionCode, languageCode)
  const previousRequest = requests.get(key)
  const isUpToDate = !isOutdated(lastUpdate) || !isOutdated(previousRequest?.requestedAt)

  if (!forceUpdate && isUpToDate && cachedData && !previousRequest?.pending) {
    return cachedData
  }

  try {
    const request =
      (previousRequest?.pending as Promise<T | null> | undefined) ??
      shareRequest(key, requestAndStore(endpoint, { regionCode, languageCode, setToDataContainer }))
    const data = await request
    return data ?? cachedData
  } catch (e) {
    if (!cachedData) {
      throw e
    }
    if (forceUpdate) {
      showSnackbar({ text: getErrorMessage(fromError(e), t) })
    }
  }
  return cachedData
}

type UseLoadWithCacheParams<T extends object> = Omit<LoadProps<T>, 't'> & {
  enabled?: boolean
}

const useLoadWithCache = <T extends object>({
  enabled = true,
  ...params
}: UseLoadWithCacheParams<T>): ReturnType<T> => {
  const { t } = useTranslation()

  return useLoadAsync<T>(
    useCallback(
      async forceUpdate =>
        enabled ? loadWithCache<T>({ ...params, forceUpdate: params.forceUpdate || forceUpdate, t }) : null,
      // Normally using params as dependency triggers infinite re-renders
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [JSON.stringify(params), enabled, t],
    ),
  )
}

export default useLoadWithCache
