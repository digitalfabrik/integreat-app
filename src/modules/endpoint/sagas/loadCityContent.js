// @flow

import type { Saga } from 'redux-saga'
import { all, call, put } from 'redux-saga/effects'
import type { DataContainer } from '../DataContainer'
import loadCategories from './loadCategories'
import loadEvents from './loadEvents'
import fetchResourceCache from './fetchResourceCache'
import moment from 'moment-timezone'
import type { PushLanguagesActionType } from '../../app/StoreActionType'
import loadLanguages from './loadLanguages'
import ResourceURLFinder from '../ResourceURLFinder'
import buildResourceFilePath from '../buildResourceFilePath'
import { ContentLoadCriterion } from '../ContentLoadCriterion'
import AppSettings from '../../settings/AppSettings'
import NetInfo from '@react-native-community/netinfo'
import loadCities from './loadCities'

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
  if (!criterion.peeking()) {
    const appSettings = new AppSettings()
    yield call(appSettings.setSelectedCity, newCity)
  }

  yield call(loadCities, dataContainer, false) // Never force refresh cities, when loading cityContent
  const lastUpdate: moment | null = yield call(dataContainer.getLastUpdate, newCity, newLanguage)

  console.debug('Last city content update on ',
    lastUpdate ? lastUpdate.toISOString() : 'never')

  const shouldUpdate = criterion.shouldUpdate(lastUpdate)

  console.debug('City content should be refreshed: ', shouldUpdate)

  if (criterion.shouldLoadLanguages()) {
    yield call(loadLanguages, newCity, dataContainer, shouldUpdate)
    const languages = yield call(dataContainer.getLanguages, newCity)

    const pushLanguages: PushLanguagesActionType = { type: 'PUSH_LANGUAGES', params: { languages } }
    yield put(pushLanguages)

    if (!languages.map(language => language.code).includes(newLanguage)) {
      return false
    }
  }

  const [categoriesMap, events] = yield all([
    call(loadCategories, newCity, newLanguage, dataContainer, shouldUpdate),
    call(loadEvents, newCity, newLanguage, dataContainer, shouldUpdate)
  ])

  const netInfo = yield call(NetInfo.fetch)
  const isCellularConnection = netInfo.type === 'cellular'

  // fetchResourceCache should be callable independent of content updates. Even if loadCategories, loadEvents,
  // loadLanguages did not update the dataContainer this is needed. In case the previous call to fetchResourceCache
  // failed to download some resources an other call could fix this and download missing files.
  if (criterion.shouldRefreshResources() && !isCellularConnection) {
    const resourceURLFinder = new ResourceURLFinder()
    resourceURLFinder.init()

    const fetchMap = resourceURLFinder.buildFetchMap(
      categoriesMap.toArray().concat(events),
      (url, path, urlHash) => buildResourceFilePath(url, path, newCity, urlHash)
    )

    resourceURLFinder.finalize()
    yield call(fetchResourceCache, newCity, newLanguage, fetchMap, dataContainer)
  }

  if (shouldUpdate) {
    yield call(dataContainer.setLastUpdate, newCity, newLanguage, moment.tz('UTC'))
  }

  return true
}
