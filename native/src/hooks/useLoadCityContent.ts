import { useCallback } from 'react'

import { CityModel, ErrorCode, fromError, LanguageModel, ReturnType, useLoadAsync } from 'api-client'

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

export type CityContentReturn<T> = ReturnType<
  {
    cities: CityModel[]
    languages: LanguageModel[]
    city: CityModel
    language: LanguageModel
    resourceCache: LanguageResourceCacheStateType
  } & T
> & { errorCode: ErrorCode | null }

const useLoadCityContent = <T>({ cityCode, languageCode, load }: UseLoadCityContentProps<T>): CityContentReturn<T> => {
  const citiesReturn = useLoadCities()
  const languagesReturn = useLoadLanguages({ cityCode })
  const otherReturn = useLoadAsync(load)

  const previousLanguageCode = useOnLanguageChange({ languageCode })

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
      return { error: null, errorCode: null }
    }
    if (citiesReturn.data && !city) {
      return { error: new Error(ErrorCode.CityUnavailable), errorCode: ErrorCode.CityUnavailable }
    }
    if (languagesReturn.data && !language) {
      return { error: new Error(ErrorCode.LanguageUnavailable), errorCode: ErrorCode.LanguageUnavailable }
    }
    const error = citiesReturn.error ?? languagesReturn.error ?? otherReturn.error ?? resourceCacheReturn.error
    return { error: error ?? null, errorCode: error ? fromError(error) : null }
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

  return { ...getError(), loading, refresh, data }
}

export default useLoadCityContent