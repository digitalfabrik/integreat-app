import moment from 'moment'
import { useCallback, useEffect } from 'react'

import {
  CategoriesMapModel,
  CityModel,
  createCategoriesEndpoint,
  createEventsEndpoint,
  createLanguagesEndpoint,
  createPOIsEndpoint,
  ErrorCode,
  EventModel,
  LanguageModel,
  PoiModel,
  ReturnType,
  useLoadAsync,
} from 'api-client'

import { LanguageResourceCacheStateType } from '../redux/StateType'
import { dataContainer } from '../utils/DefaultDataContainer'
import { reportError } from '../utils/sentry'
import useLoadCities from './useLoadCities'
import useLoadWithCache from './useLoadWithCache'
import useOnLanguageChange from './useOnLanguageChange'
import useSnackbar from './useSnackbar'

type Params = {
  cityCode: string
  languageCode: string
}

export type CityContentData = {
  cities: CityModel[]
  languages: LanguageModel[]
  city: CityModel
  language: LanguageModel
  categories: CategoriesMapModel
  events: EventModel[]
  pois: PoiModel[]
  resourceCache: LanguageResourceCacheStateType
}

export type CityContentReturn = Omit<ReturnType<CityContentData>, 'error'> & { error: ErrorCode | Error | null }

/**
 * Hook to load all the offline available city content at once and handle errors, loading and refreshing at the same time.
 * Takes care of updating the data regularly.
 */
const useLoadCityContent = ({ cityCode, languageCode }: Params): CityContentReturn => {
  const citiesReturn = useLoadCities()
  const previousLanguageCode = useOnLanguageChange({ languageCode })
  const showSnackbar = useSnackbar()
  const params = { cityCode, languageCode, showSnackbar }

  const languagesReturn = useLoadWithCache({
    ...params,
    isAvailable: dataContainer.languagesAvailable,
    createEndpoint: createLanguagesEndpoint,
    getFromDataContainer: dataContainer.getLanguages,
    setToDataContainer: (cityCode, languageCode, data) => dataContainer.setLanguages(cityCode, data),
  })
  const categoriesReturn = useLoadWithCache({
    ...params,
    isAvailable: dataContainer.categoriesAvailable,
    createEndpoint: createCategoriesEndpoint,
    getFromDataContainer: dataContainer.getCategoriesMap,
    setToDataContainer: dataContainer.setCategoriesMap,
  })
  const eventsReturn = useLoadWithCache({
    ...params,
    isAvailable: dataContainer.eventsAvailable,
    createEndpoint: createEventsEndpoint,
    getFromDataContainer: dataContainer.getEvents,
    setToDataContainer: dataContainer.setEvents,
  })
  const poisReturn = useLoadWithCache({
    ...params,
    isAvailable: dataContainer.poisAvailable,
    createEndpoint: createPOIsEndpoint,
    getFromDataContainer: dataContainer.getPois,
    setToDataContainer: dataContainer.setPois,
  })

  useEffect(() => {
    // Update last update if all data is available.
    // WARNING: This also means that the last update is updated if everything is just loaded from the cache.
    if (languagesReturn.data && categoriesReturn.data && eventsReturn.data && poisReturn.data) {
      dataContainer.setLastUpdate(cityCode, languageCode, moment()).catch(reportError)
    }
  }, [languagesReturn, categoriesReturn, eventsReturn, poisReturn, cityCode, languageCode])

  // TODO IGAPP-636: Actually load resource cache and move to separate hook
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
    return (
      citiesReturn.error ??
      languagesReturn.error ??
      categoriesReturn.error ??
      eventsReturn.error ??
      poisReturn.error ??
      resourceCacheReturn.error ??
      null
    )
  }

  const loading =
    citiesReturn.loading ||
    languagesReturn.loading ||
    categoriesReturn.loading ||
    eventsReturn.loading ||
    poisReturn.loading ||
    resourceCacheReturn.loading

  const refresh = () => {
    citiesReturn.refresh()
    languagesReturn.refresh()
    categoriesReturn.refresh()
    eventsReturn.refresh()
    poisReturn.refresh()
    resourceCacheReturn.refresh()
  }

  const data =
    city &&
    language &&
    citiesReturn.data &&
    languagesReturn.data &&
    categoriesReturn.data &&
    eventsReturn.data &&
    poisReturn.data &&
    resourceCacheReturn.data
      ? {
          city,
          language,
          cities: citiesReturn.data,
          languages: languagesReturn.data,
          categories: categoriesReturn.data,
          events: eventsReturn.data,
          pois: poisReturn.data,
          resourceCache: resourceCacheReturn.data,
        }
      : null

  return { error: getError(), loading, refresh, data }
}
export default useLoadCityContent
