import { useCallback } from 'react'

import { Endpoint, ErrorCode, loadFromEndpoint, ReturnType, useLoadAsync } from 'api-client'

import { determineApiUrl } from '../utils/helpers'
import useLoadCityContent, { CityContentData } from './useLoadCityContent'

type Params = {
  cityCode: string
  languageCode: string
}

type Load<T> =
  | {
      createEndpoint: (baseUrl: string) => Endpoint<{ city: string; language: string }, T>
      load?: null
    }
  | {
      load: () => Promise<T>
      createEndpoint?: null
    }

type UseLoadExtraCityContentParams<T> = Params & Load<T>

type UseLoadExtraCityContentData<T> = CityContentData & { extra: T }
export type UseLoadExtraCityContentReturn<T> = Omit<ReturnType<UseLoadExtraCityContentData<T>>, 'error'> & {
  error: ErrorCode | Error | null
}

/**
 * Hook to load city content and some other data at the same time.
 * Either a function creating an endpoint or a regular async function to load the data has to be passed.
 */
const useLoadExtraCityContent = <T>({
  cityCode,
  languageCode,
  createEndpoint,
  load,
}: UseLoadExtraCityContentParams<T>): UseLoadExtraCityContentReturn<T> => {
  const { refresh: refreshCityContent, ...cityContentReturn } = useLoadCityContent({ cityCode, languageCode })
  const loadAsync = useCallback(
    async () =>
      load
        ? load()
        : loadFromEndpoint(createEndpoint, await determineApiUrl(), { city: cityCode, language: languageCode }),
    [createEndpoint, load, cityCode, languageCode]
  )
  const { refresh: refreshExtra, ...extraReturn } = useLoadAsync(loadAsync)

  const refresh = useCallback(() => {
    refreshCityContent()
    refreshExtra()
  }, [refreshCityContent, refreshExtra])

  return {
    loading: cityContentReturn.loading || extraReturn.loading,
    error: cityContentReturn.error || extraReturn.error,
    refresh,
    data: cityContentReturn.data && extraReturn.data && { ...cityContentReturn.data, extra: extraReturn.data },
  }
}

export default useLoadExtraCityContent
