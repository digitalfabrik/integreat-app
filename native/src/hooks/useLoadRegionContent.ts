import { DateTime } from 'luxon'
import { useEffect } from 'react'

import {
  CategoriesMapModel,
  RegionModel,
  ErrorCode,
  createCategoriesEndpoint,
  createEventsEndpoint,
  createNewsEndpoint,
  createPlacesEndpoint,
  EventModel,
  LanguageModel,
  NewsModel,
  PlaceModel,
  ReturnType,
  createRegionsEndpoint,
} from 'shared/api'

import dataContainer from '../utils/DefaultDataContainer'
import loadResourceCache from '../utils/loadResourceCache'
import { reportError } from '../utils/sentry'
import useLoadWithCache from './useLoadWithCache'
import usePreviousProp from './usePreviousProp'
import useSnackbar from './useSnackbar'

type Params = {
  regionCode: string
  languageCode: string
  refreshNews?: boolean
}

export type RegionContentData = {
  regions: RegionModel[]
  languages: LanguageModel[]
  region: RegionModel
  language: LanguageModel
  categories: CategoriesMapModel
  events: EventModel[]
  news: NewsModel[]
  places: PlaceModel[]
}

export type RegionContentReturn = Omit<Omit<ReturnType<RegionContentData>, 'error'>, 'setData'> & {
  error: ErrorCode | Error | null
}

/**
 * Hook to load all the offline available region content at once and handle errors, loading and refreshing at the same time.
 * Takes care of updating the data regularly.
 */
const useLoadRegionContent = ({ regionCode, languageCode, refreshNews }: Params): RegionContentReturn => {
  const showSnackbar = useSnackbar()
  const previousLanguageCode = usePreviousProp({ prop: languageCode })
  const params = { regionCode, languageCode, showSnackbar }

  const regionsReturn = useLoadWithCache({
    ...params,
    isAvailable: dataContainer.regionsAvailable,
    createEndpoint: createRegionsEndpoint,
    getFromDataContainer: dataContainer.getRegions,
    setToDataContainer: (_, __, regions) => dataContainer.setRegions(regions),
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
  const placesReturn = useLoadWithCache({
    ...params,
    isAvailable: dataContainer.placesAvailable,
    createEndpoint: createPlacesEndpoint,
    getFromDataContainer: dataContainer.getPlaces,
    setToDataContainer: dataContainer.setPlaces,
  })
  const newsReturn = useLoadWithCache({
    ...params,
    isAvailable: dataContainer.newsAvailable,
    createEndpoint: createNewsEndpoint,
    getFromDataContainer: dataContainer.getNews,
    setToDataContainer: dataContainer.setNews,
    forceUpdate: refreshNews,
  })

  useEffect(() => {
    if (regionsReturn.data && categoriesReturn.data && eventsReturn.data && placesReturn.data && newsReturn.data) {
      // Load the resource cache in the background once a day and do not wait for it
      dataContainer.getLastUpdate(regionCode, languageCode).then(lastUpdate => {
        if (!lastUpdate || lastUpdate < DateTime.utc().startOf('day')) {
          loadResourceCache({
            regionCode,
            languageCode,
            categories: categoriesReturn.data,
            events: eventsReturn.data,
            places: placesReturn.data,
          }).catch(reportError)
        }
      })

      // Update last update if all data is available.
      // WARNING: This also means that the last update is updated if everything is just loaded from the cache.
      dataContainer.setLastUpdate(regionCode, languageCode, DateTime.utc()).catch(reportError)
    }
  }, [regionsReturn, categoriesReturn, eventsReturn, placesReturn, newsReturn, regionCode, languageCode])

  const region = regionsReturn.data?.find(it => it.code === regionCode)
  const language = region?.languages.find(it => it.code === languageCode)

  const getError = () => {
    if (previousLanguageCode !== languageCode) {
      // Prevent flickering if unavailable language changed
      return null
    }
    if (regionsReturn.data && !region) {
      return ErrorCode.RegionUnavailable
    }
    if (region && !language) {
      return ErrorCode.LanguageUnavailable
    }
    return (
      regionsReturn.error ??
      categoriesReturn.error ??
      eventsReturn.error ??
      placesReturn.error ??
      newsReturn.error ??
      null
    )
  }

  const loading =
    regionsReturn.loading ||
    categoriesReturn.loading ||
    eventsReturn.loading ||
    placesReturn.loading ||
    newsReturn.loading

  const refresh = () => {
    regionsReturn.refresh()
    categoriesReturn.refresh()
    eventsReturn.refresh()
    placesReturn.refresh()
    newsReturn.refresh()
  }

  const data =
    region &&
    language &&
    regionsReturn.data &&
    categoriesReturn.data &&
    eventsReturn.data &&
    placesReturn.data &&
    newsReturn.data
      ? {
          region,
          language,
          regions: regionsReturn.data,
          languages: region.languages,
          categories: categoriesReturn.data,
          events: eventsReturn.data,
          places: placesReturn.data,
          news: newsReturn.data,
        }
      : null

  return { error: getError(), loading, refresh, data }
}
export default useLoadRegionContent
