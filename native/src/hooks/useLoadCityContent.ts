import moment from 'moment'
import { useCallback } from 'react'

import {
  CategoriesMapModel,
  CityModel,
  createCategoriesEndpoint,
  createEventsEndpoint,
  createLanguagesEndpoint,
  createPOIsEndpoint,
  Endpoint,
  ErrorCode,
  EventModel,
  fromError,
  LanguageModel,
  PoiModel,
  ReturnType,
  useLoadAsync,
} from 'api-client'

import { SnackbarType } from '../components/SnackbarContainer'
import { LanguageResourceCacheStateType } from '../redux/StateType'
import { dataContainer } from '../utils/DefaultDataContainer'
import { determineApiUrl } from '../utils/helpers'
import useLoadCities from './useLoadCities'
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

type Load<T> = {
  cityCode: string
  languageCode: string
  createEndpoint: (baseUrl: string) => Endpoint<{ city: string; language: string }, T>
  isAvailable: (cityCode: string, languageCode: string) => Promise<boolean>
  getFromDataContainer: (cityCode: string, languageCode: string) => Promise<T>
  setToDataContainer: (cityCode: string, languageCode: string, data: T) => Promise<void>
  forceUpdate?: boolean
  showSnackbar: (snackbar: SnackbarType) => void
}

const loadWithCache = async <T>({
  cityCode,
  languageCode,
  isAvailable,
  getFromDataContainer,
  setToDataContainer,
  createEndpoint,
  showSnackbar,
  forceUpdate = false,
}: Load<T>): Promise<T | null> => {
  const cachedData = (await isAvailable(cityCode, languageCode))
    ? await getFromDataContainer(cityCode, languageCode)
    : null

  const lastUpdate = await dataContainer.getLastUpdate(cityCode, languageCode)
  const shouldUpdate = forceUpdate || !lastUpdate || lastUpdate.isBefore(moment.utc().startOf('day'))

  if (!shouldUpdate && cachedData) {
    return cachedData
  }

  try {
    const payload = await createEndpoint(await determineApiUrl()).request({
      city: cityCode,
      language: languageCode,
    })
    if (payload.data) {
      await setToDataContainer(cityCode, languageCode, payload.data)
    }
    return payload.data ?? cachedData
  } catch (e) {
    if (cachedData) {
      showSnackbar({ text: fromError(e) })
    } else {
      throw e
    }
  }
  return cachedData
}

const useLoadWithCache = <T>(params: Load<T>) =>
  useLoadAsync(useCallback(forceUpdate => loadWithCache({ ...params, forceUpdate }), [params]))

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
