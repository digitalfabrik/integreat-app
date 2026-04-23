import { useCallback } from 'react'

import { loadFromEndpoint, ReturnType, useLoadAsync, Endpoint, ErrorCode } from 'shared/api'

import { determineApiUrl } from '../utils/helpers'
import useLoadRegionContent, { RegionContentData } from './useLoadRegionContent'

type Params = {
  regionCode: string
  languageCode: string
}

type Load<T extends object> =
  | {
      createEndpoint: (baseUrl: string) => Endpoint<{ region: string; language: string }, T>
      load?: null
    }
  | {
      load: () => Promise<T>
      createEndpoint?: null
    }

type UseLoadExtraRegionContentParams<T extends object> = Params & Load<T>

type UseLoadExtraRegionContentData<T> = RegionContentData & { extra: T }
export type UseLoadExtraRegionContentReturn<T> = Omit<
  Omit<ReturnType<UseLoadExtraRegionContentData<T>>, 'error'>,
  'setData'
> & {
  error: ErrorCode | Error | null
}

/**
 * Hook to load region content and some other data at the same time.
 * Either a function creating an endpoint or a regular async function to load the data has to be passed.
 */
const useLoadExtraRegionContent = <T extends object>({
  regionCode,
  languageCode,
  createEndpoint,
  load,
}: UseLoadExtraRegionContentParams<T>): UseLoadExtraRegionContentReturn<T> => {
  const { refresh: refreshRegionContent, ...regionContentReturn } = useLoadRegionContent({ regionCode, languageCode })
  const loadAsync = useCallback(
    async () =>
      load
        ? load()
        : loadFromEndpoint(createEndpoint, await determineApiUrl(), { region: regionCode, language: languageCode }),
    [createEndpoint, load, regionCode, languageCode],
  )
  const { refresh: refreshExtra, ...extraReturn } = useLoadAsync(loadAsync)

  const refresh = useCallback(() => {
    refreshRegionContent()
    refreshExtra()
  }, [refreshRegionContent, refreshExtra])

  return {
    loading: regionContentReturn.loading || extraReturn.loading,
    error: regionContentReturn.error ?? extraReturn.error,
    refresh,
    data:
      regionContentReturn.data && extraReturn.data ? { ...regionContentReturn.data, extra: extraReturn.data } : null,
  }
}

export default useLoadExtraRegionContent
