// @flow

import type { Saga } from 'redux-saga'
import { all, call, put } from 'redux-saga/effects'
import type { DataContainer } from '../DataContainer'
import loadCategories from './loadCategories'
import loadEvents from './loadEvents'
import fetchResourceCache from './fetchResourceCache'
import moment from 'moment-timezone'
import type { FetchCitiesActionType, InitializeCityContentActionType } from '../../app/StoreActionType'
import loadLanguages from './loadLanguages'
import ResourceURLFinder from '../ResourceURLFinder'
import buildResourceFilePath from '../buildResourceFilePath'
import { ContentLoadCriterion } from '../ContentLoadCriterion'
import DatabaseContext from '../DatabaseContext'
import AppSettings from '../../settings/AppSettings'

/**
 *
 * @param dataContainer
 * @param newCity
 * @param newLanguage
 * @param criterion
 * @returns Returns a saga which returns whether all data was loaded and
 *          the inputs (like newCity, newLanguage) are valid
 */
export default function * loadCityContent (
  dataContainer: DataContainer, newCity: string, newLanguage: string,
  criterion: ContentLoadCriterion
): Saga<boolean> {
  const appSettings = new AppSettings()
  yield call(appSettings.setSelectedCity, newCity)

  const context = new DatabaseContext(newCity, newLanguage)

  const fetchCities: FetchCitiesActionType = { type: 'FETCH_CITIES' }
  yield put(fetchCities)

  const lastUpdate: moment | null = yield call(dataContainer.getLastUpdate, context)

  console.debug('Last city content update on ',
    lastUpdate ? lastUpdate.toISOString() : 'never')

  const shouldUpdate = criterion.shouldUpdate(lastUpdate)

  console.debug('City content should be refreshed: ', shouldUpdate)

  if (criterion.shouldLoadLanguages()) {
    yield call(loadLanguages, context, dataContainer, shouldUpdate)
    const languages = yield call(dataContainer.getLanguages, context)

    const initializeCityContent: InitializeCityContentActionType = {
      type: 'INITIALIZE_CITY_CONTENT',
      params: {
        city: newCity,
        language: newLanguage,
        languages
      }
    }

    yield put(initializeCityContent)

    if (!languages.map(language => language.code).includes(newLanguage)) {
      return false
    }
  }

  const [categoriesMap, events] = yield all([
    call(loadCategories, newCity, newLanguage, dataContainer, shouldUpdate),
    call(loadEvents, newCity, newLanguage, dataContainer, shouldUpdate)
  ])

  // fetchResourceCache should be callable independent of content updates. Even if loadCategories, loadEvents,
  // loadLanguages did not update the dataContainer this is needed. In case the previous call to fetchResourceCache
  // failed to download some resources an other call could fix this and download missing files.
  if (criterion.shouldRefreshResources()) {
    const resourceURLFinder = new ResourceURLFinder()
    resourceURLFinder.init()

    const fetchMap = resourceURLFinder.buildFetchMap(
      categoriesMap.toArray().concat(events),
      (url, path) => buildResourceFilePath(url, path, newCity)
    )

    resourceURLFinder.finalize()
    yield call(fetchResourceCache, newCity, newLanguage, fetchMap, dataContainer)
  }

  if (shouldUpdate) {
    yield call(dataContainer.setLastUpdate, context, moment.tz('UTC'))
  }

  return true
}
