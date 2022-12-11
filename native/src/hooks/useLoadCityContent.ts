import { useCallback } from 'react'

import { CityModel, Endpoint, ErrorCode, LanguageModel, ReturnType, useLoadAsync } from 'api-client'

import { LanguageResourceCacheStateType } from '../redux/StateType'
import { dataContainer } from '../utils/DefaultDataContainer'
import { determineApiUrl } from '../utils/helpers'
import useLoadCities from './useLoadCities'
import useLoadLanguages from './useLoadLanguages'
import useOnLanguageChange from './useOnLanguageChange'

type Params = {
  cityCode: string
  languageCode: string
}

type UseRawLoadCityContentProps<T> = Params & {
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

const useRawLoadCityContent = <T>({
  cityCode,
  languageCode,
  load,
}: UseRawLoadCityContentProps<T>): CityContentReturn<T> => {
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

type UseLoadCityContentProps<T, P> =
  | UseRawLoadCityContentProps<P>
  | (Params & {
      map: (data: T) => P
      createEndpoint: (baseUrl: string) => Endpoint<{ city: string; language: string }, T>
      isAvailable?: (cityCode: string, languageCode: string) => Promise<boolean>
      getFromDataContainer?: (cityCode: string, languageCode: string) => Promise<T>
      setToDataContainer?: (cityCode: string, languageCode: string, data: T) => Promise<void>
      load?: undefined
    })

const useLoadCityContent = <T, P>({
  cityCode,
  languageCode,
  ...props
}: UseLoadCityContentProps<T, P>): CityContentReturn<P> => {
  const load = useCallback(async () => {
    if (props.load) {
      return props.load()
    }
    const { isAvailable, getFromDataContainer, setToDataContainer, map, createEndpoint } = props
    if (isAvailable && getFromDataContainer && (await isAvailable(cityCode, languageCode))) {
      return map(await getFromDataContainer(cityCode, languageCode))
    }

    const payload = await createEndpoint(await determineApiUrl()).request({
      city: cityCode,
      language: languageCode,
    })
    if (payload.data && setToDataContainer) {
      await setToDataContainer(cityCode, languageCode, payload.data)
    }
    return payload.data ? map(payload.data) : null
  }, [cityCode, languageCode, props])

  return useRawLoadCityContent({ cityCode, languageCode, load })
}

export default useLoadCityContent
