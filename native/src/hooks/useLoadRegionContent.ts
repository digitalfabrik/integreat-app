import { DateTime } from 'luxon'
import { useEffect } from 'react'

import {
  CategoriesMapModel,
  RegionModel,
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
  refreshLocalNews?: boolean
}

export type RegionContentData = {
  regions: RegionModel[]
  languages: LanguageModel[]
  region: RegionModel
  language: LanguageModel
  categories: CategoriesMapModel
  events: EventModel[]
  localNews: LocalNewsModel[]
  pois: PoiModel[]
}

export type RegionContentReturn = Omit<Omit<ReturnType<RegionContentData>, 'error'>, 'setData'> & {
  error: ErrorCode | Error | null
}

/**
 * Hook to load all the offline available region content at once and handle errors, loading and refreshing at the same time.
 * Takes care of updating the data regularly.
 */
const useLoadRegionContent = ({ regionCode, languageCode, refreshLocalNews }: Params): RegionContentReturn => {
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
    if (regionsReturn.data && categoriesReturn.data && eventsReturn.data && poisReturn.data && localNewsReturn.data) {
      // Load the resource cache in the background once a day and do not wait for it
      dataContainer.getLastUpdate(regionCode, languageCode).then(lastUpdate => {
        if (!lastUpdate || lastUpdate < DateTime.utc().startOf('day')) {
          loadResourceCache({
            regionCode,
            languageCode,
            categories: categoriesReturn.data,
            events: eventsReturn.data,
            pois: poisReturn.data,
          }).catch(reportError)
        }
      })

      // Update last update if all data is available.
      // WARNING: This also means that the last update is updated if everything is just loaded from the cache.
      dataContainer.setLastUpdate(regionCode, languageCode, DateTime.utc()).catch(reportError)
    }
  }, [regionsReturn, categoriesReturn, eventsReturn, poisReturn, localNewsReturn, regionCode, languageCode])

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
      poisReturn.error ??
      localNewsReturn.error ??
      null
    )
  }

  const loading =
    regionsReturn.loading ||
    categoriesReturn.loading ||
    eventsReturn.loading ||
    poisReturn.loading ||
    localNewsReturn.loading

  const refresh = () => {
    regionsReturn.refresh()
    categoriesReturn.refresh()
    eventsReturn.refresh()
    poisReturn.refresh()
    localNewsReturn.refresh()
  }

  const data =
    region &&
    language &&
    regionsReturn.data &&
    categoriesReturn.data &&
    eventsReturn.data &&
    poisReturn.data &&
    localNewsReturn.data
      ? {
          region,
          language,
          regions: regionsReturn.data,
          languages: region.languages,
          categories: categoriesReturn.data,
          events: eventsReturn.data,
          pois: poisReturn.data,
          localNews: localNewsReturn.data,
        }
      : null

  return { error: getError(), loading, refresh, data }
}
export default useLoadRegionContent
