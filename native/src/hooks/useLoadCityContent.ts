import { DateTime } from 'luxon'
import { useEffect } from 'react'

import {
  CategoriesMapModel,
  CityModel,
  ErrorCode,
  createCategoriesEndpoint,
  createEventsEndpoint,
  createLocalNewsEndpoint,
  createPOIsEndpoint,
  EventModel,
  LanguageModel,
  LocalNewsModel,
  PoiModel,
  ReturnType,
  createCitiesEndpoint,
} from 'shared/api'

import dataContainer from '../utils/DefaultDataContainer'
import loadResourceCache from '../utils/loadResourceCache'
import { reportError } from '../utils/sentry'
import useLoadWithCache from './useLoadWithCache'
import usePreviousProp from './usePreviousProp'
import useSnackbar from './useSnackbar'

type Params = {
  cityCode: string
  languageCode: string
  refreshLocalNews?: boolean
}

export type CityContentData = {
  cities: CityModel[]
  languages: LanguageModel[]
  city: CityModel
  language: LanguageModel
  categories: CategoriesMapModel
  events: EventModel[]
  localNews: LocalNewsModel[]
  pois: PoiModel[]
}

export type CityContentReturn = Omit<Omit<ReturnType<CityContentData>, 'error'>, 'setData'> & {
  error: ErrorCode | Error | null
}

/**
 * Hook to load all the offline available city content at once and handle errors, loading and refreshing at the same time.
 * Takes care of updating the data regularly.
 */
const useLoadCityContent = ({ cityCode, languageCode, refreshLocalNews }: Params): CityContentReturn => {
  const showSnackbar = useSnackbar()
  const previousLanguageCode = usePreviousProp({ prop: languageCode })
  const params = { cityCode, languageCode, showSnackbar }

  const citiesReturn = useLoadWithCache({
    ...params,
    isAvailable: dataContainer.citiesAvailable,
    createEndpoint: createCitiesEndpoint,
    getFromDataContainer: dataContainer.getCities,
    setToDataContainer: (_, __, cities) => dataContainer.setCities(cities),
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
  const localNewsReturn = useLoadWithCache({
    ...params,
    isAvailable: dataContainer.localNewsAvailable,
    createEndpoint: createLocalNewsEndpoint,
    getFromDataContainer: dataContainer.getLocalNews,
    setToDataContainer: dataContainer.setLocalNews,
    forceUpdate: refreshLocalNews,
  })

  useEffect(() => {
    if (citiesReturn.data && categoriesReturn.data && eventsReturn.data && poisReturn.data && localNewsReturn.data) {
      // Load the resource cache in the background once a day and do not wait for it
      dataContainer.getLastUpdate(cityCode, languageCode).then(lastUpdate => {
        if (!lastUpdate || lastUpdate < DateTime.utc().startOf('day')) {
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
      dataContainer.setLastUpdate(cityCode, languageCode, DateTime.utc()).catch(reportError)
    }
  }, [citiesReturn, categoriesReturn, eventsReturn, poisReturn, localNewsReturn, cityCode, languageCode])

  const city = citiesReturn.data?.find(it => it.code === cityCode)
  const language = city?.languages.find(it => it.code === languageCode)

  const getError = () => {
    if (previousLanguageCode !== languageCode) {
      // Prevent flickering if unavailable language changed
      return null
    }
    if (citiesReturn.data && !city) {
      return ErrorCode.CityUnavailable
    }
    if (city && !language) {
      return ErrorCode.LanguageUnavailable
    }
    return (
      citiesReturn.error ??
      categoriesReturn.error ??
      eventsReturn.error ??
      poisReturn.error ??
      localNewsReturn.error ??
      null
    )
  }

  const loading =
    citiesReturn.loading ||
    categoriesReturn.loading ||
    eventsReturn.loading ||
    poisReturn.loading ||
    localNewsReturn.loading

  const refresh = () => {
    citiesReturn.refresh()
    categoriesReturn.refresh()
    eventsReturn.refresh()
    poisReturn.refresh()
    localNewsReturn.refresh()
  }

  const data =
    city &&
    language &&
    citiesReturn.data &&
    categoriesReturn.data &&
    eventsReturn.data &&
    poisReturn.data &&
    localNewsReturn.data
      ? {
          city,
          language,
          cities: citiesReturn.data,
          languages: city.languages,
          categories: categoriesReturn.data,
          events: eventsReturn.data,
          pois: poisReturn.data,
          localNews: localNewsReturn.data,
        }
      : null

  return { error: getError(), loading, refresh, data }
}
export default useLoadCityContent
