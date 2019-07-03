// @flow

import type { Saga } from 'redux-saga'
import { all, call, put } from 'redux-saga/effects'
import type { DataContainer } from '../DataContainer'
import loadCategories from './loadCategories'
import loadEvents from './loadEvents'
import fetchResourceCache from './fetchResourceCache'
import moment from 'moment-timezone'
import type { InitializeCityContentActionType } from '../../app/StoreActionType'
import loadLanguages from './loadLanguages'
import ResourceURLFinder from '../ResourceURLFinder'
import buildResourceFilePath from '../buildResourceFilePath'
import AppSettings from '../../settings/AppSettings'

const MAX_CONTENT_AGE = 24

export default function * loadCityContent (
  dataContainer: DataContainer, newCity: string, newLanguage: string,
  forceUpdate: boolean, shouldRefreshResources: boolean
): Saga<void> {
  const appSettings = new AppSettings()
  yield call(appSettings.setSelectedCity, newCity)

  yield call(dataContainer.setContext, newCity, newLanguage)

  let lastUpdate: moment | null = null
  if (dataContainer.lastUpdateAvailable()) {
    lastUpdate = yield call(dataContainer.getLastUpdate)
  }

  console.debug('Last city content update on ',
    lastUpdate ? lastUpdate.toISOString() : 'never')

  // The last update was more than 24h ago or a refresh should be forced
  const shouldUpdate = forceUpdate || !lastUpdate ||
    lastUpdate.isBefore(moment.tz('UTC').subtract(MAX_CONTENT_AGE, 'hours'))

  console.debug('City content should be refreshed: ', shouldUpdate)

  yield call(loadLanguages, newCity, dataContainer, shouldUpdate)
  const languages = yield call(dataContainer.getLanguages)

  const initializeCityContent: InitializeCityContentActionType = {
    type: 'INITIALIZE_CITY_CONTENT',
    params: {
      city: newCity,
      language: newLanguage,
      languages
    }
  }

  yield put(initializeCityContent)

  if (languages.map(language => language.code).includes(newLanguage)) {
    const [categoriesMap, events] = yield all([
      call(loadCategories, newCity, newLanguage, dataContainer, shouldUpdate),
      call(loadEvents, newCity, newLanguage, dataContainer, shouldUpdate)
    ])

    // fetchResourceCache should be callable independent of content updates. Even if loadCategories, loadEvents,
    // loadLanguages did not update the dataContainer this is needed. In case the previous call to fetchResourceCache
    // failed to download some resources an other call could fix this and download missing files.
    if (shouldRefreshResources) {
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
      yield call(dataContainer.setLastUpdate, moment.tz('UTC'))
    }
  } else {
    throw new Error('Language is not available')
  }
}
