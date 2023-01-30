import moment from 'moment'
import { useEffect } from 'react'

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
} from 'api-client'

import dataContainer from '../utils/DefaultDataContainer'
import loadResourceCache from '../utils/loadResourceCache'
import { reportError } from '../utils/sentry'
import useLoadCities from './useLoadCities'
import useLoadWithCache from './useLoadWithCache'
import usePreviousProp from './usePreviousProp'
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
}

export type CityContentReturn = Omit<ReturnType<CityContentData>, 'error'> & { error: ErrorCode | Error | null }

/**
 * Hook to load all the offline available city content at once and handle errors, loading and refreshing at the same time.
 * Takes care of updating the data regularly.
 */
const useLoadCityContent = ({ cityCode, languageCode }: Params): CityContentReturn => {
  const citiesReturn = useLoadCities()
  const previousLanguageCode = usePreviousProp({ prop: languageCode })
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
    if (languagesReturn.data && categoriesReturn.data && eventsReturn.data && poisReturn.data) {
      // Load the resource cache in the background once a day and do not wait for it
      dataContainer.getLastUpdate(cityCode, languageCode).then(lastUpdate => {
        if (!lastUpdate || lastUpdate.isBefore(moment.utc().startOf('day'))) {
          loadResourceCache({
            cityCode,
            languageCode,
            categories: categoriesReturn.data,
            events: eventsReturn.data,
            pois: poisReturn.data,
          }).catch(reportError)
        }
      })

      // Update last update if all data is available.
      // WARNING: This also means that the last update is updated if everything is just loaded from the cache.
      dataContainer.setLastUpdate(cityCode, languageCode, moment()).catch(reportError)
    }
  }, [languagesReturn, categoriesReturn, eventsReturn, poisReturn, cityCode, languageCode])

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
      null
    )
  }

  const loading =
    citiesReturn.loading ||
    languagesReturn.loading ||
    categoriesReturn.loading ||
    eventsReturn.loading ||
    poisReturn.loading

  const refresh = () => {
    citiesReturn.refresh()
    languagesReturn.refresh()
    categoriesReturn.refresh()
    eventsReturn.refresh()
    poisReturn.refresh()
  }

  const data =
    city &&
    language &&
    citiesReturn.data &&
    languagesReturn.data &&
    categoriesReturn.data &&
    eventsReturn.data &&
    poisReturn.data
      ? {
          city,
          language,
          cities: citiesReturn.data,
          languages: languagesReturn.data,
          categories: categoriesReturn.data,
          events: eventsReturn.data,
          pois: poisReturn.data,
        }
      : null

  return { error: getError(), loading, refresh, data }
}
export default useLoadCityContent
