import { useCallback } from 'react'

import { CityModel, ErrorCode, LanguageModel, ReturnType, useLoadAsync } from 'api-client'

import { LanguageResourceCacheStateType } from '../redux/StateType'
import { dataContainer } from '../utils/DefaultDataContainer'
import useLoadCities from './useLoadCities'
import useLoadLanguages from './useLoadLanguages'
import useOnLanguageChange from './useOnLanguageChange'

type UseLoadCityContentProps<T> = {
  cityCode: string
  languageCode: string
  load: () => Promise<T | null>
}

export type CityContentData<T> = {
  cities: CityModel[]
  languages: LanguageModel[]
  city: CityModel
  language: LanguageModel
  resourceCache: LanguageResourceCacheStateType
} & T
export type CityContentReturn<T> = Omit<ReturnType<CityContentData<T>>, 'error'> & { error: ErrorCode | Error | null }

const useLoadCityContent = <T>({ cityCode, languageCode, load }: UseLoadCityContentProps<T>): CityContentReturn<T> => {
  const citiesReturn = useLoadCities()
  const languagesReturn = useLoadLanguages({ cityCode })
  const otherReturn = useLoadAsync(load)

  const previousLanguageCode = useOnLanguageChange({ languageCode })

  // TODO IGAPP-636: Actually load resource cache
  const loadResourceCache = useCallback(
    async () => dataContainer.getResourceCache(cityCode, languageCode),
    [cityCode, languageCode]
  )

  const resourceCacheReturn = useLoadAsync(loadResourceCache)

  const city = citiesReturn.data?.find(it => it.code === cityCode)
  const language = languagesReturn.data?.find(it => it.code === languageCode)

  const getError = () => {
    if (previousLanguageCode !== languageCode) {
      // Prevent flickering if unavailable language changed
      return null
    }
    if (citiesReturn.data && !city) {
      return ErrorCode.CityUnavailable
    }
    if (languagesReturn.data && !language) {
      return ErrorCode.LanguageUnavailable
    }
    return citiesReturn.error ?? languagesReturn.error ?? otherReturn.error ?? resourceCacheReturn.error ?? null
  }

  const loading = citiesReturn.loading || languagesReturn.loading || otherReturn.loading || resourceCacheReturn.loading
  const refresh = () => {
    citiesReturn.refresh()
    languagesReturn.refresh()
    otherReturn.refresh()
    resourceCacheReturn.refresh()
  }

  const data =
    city && language && citiesReturn.data && languagesReturn.data && otherReturn.data && resourceCacheReturn.data
      ? {
          city,
          language,
          cities: citiesReturn.data,
          languages: languagesReturn.data,
          resourceCache: resourceCacheReturn.data,
          ...otherReturn.data,
        }
      : null

  return { error: getError(), loading, refresh, data }
}

// Simple utility helper to just load cities and languages
export const useSimpleLoadCityContent = (params: {
  cityCode: string
  languageCode: string
}): CityContentReturn<unknown> =>
  useLoadCityContent({ ...params, load: useCallback(async () => ({ unused: true }), []) })

export default useLoadCityContent
