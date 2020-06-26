// @flow

import type { Saga } from 'redux-saga'
import { all, call, put } from 'redux-saga/effects'
import type { DataContainer } from '../DataContainer'
import loadCategories from './loadCategories'
import loadEvents from './loadEvents'
import fetchResourceCache from './fetchResourceCache'
import type Moment from 'moment'
import moment from 'moment'
import type { FetchLanguagesFailedActionType, PushLanguagesActionType } from '../../app/StoreActionType'
import loadLanguages from './loadLanguages'
import ResourceURLFinder from '../ResourceURLFinder'
import buildResourceFilePath from '../buildResourceFilePath'
import { ContentLoadCriterion } from '../ContentLoadCriterion'
import AppSettings from '../../settings/AppSettings'
import NetInfo from '@react-native-community/netinfo'
import loadCities from './loadCities'
import { fromError } from '../../error/ErrorCodes'
import buildConfig from '../../app/constants/buildConfig'

/**
 *
 * @param dataContainer
 * @param newCity
 * @param newLanguage
 * @param criterion
 * @returns Returns a saga which returns whether the newLanguage is available for newCity
 * @throws if the saga was unable to load necessary data
 */
export default function * loadCityContent (
  dataContainer: DataContainer, newCity: string, newLanguage: string,
  criterion: ContentLoadCriterion
): Saga<boolean> {
  yield call(dataContainer.storeLastUsage, newCity, criterion.peeking())

  if (!criterion.peeking()) {
    const appSettings = new AppSettings()
    yield call(appSettings.setSelectedCity, newCity)
  }

  const lastUpdate: Moment | null = yield call(dataContainer.getLastUpdate, newCity, newLanguage)
  console.debug('Last city content update on ', lastUpdate ? lastUpdate.toISOString() : 'never')

  const shouldUpdate = criterion.shouldUpdate(lastUpdate)
  console.debug('City content should be refreshed: ', shouldUpdate)

  const cities = yield call(loadCities, dataContainer, shouldUpdate) // Refresh for flags like eventsEnabled necessary
  const cityModel = cities.find(city => city.code === newCity)
  if (!cityModel) {
    throw new Error(`City '${newCity}' was not found.`)
  }

  if (criterion.shouldLoadLanguages()) {
    try {
      yield call(loadLanguages, newCity, dataContainer, shouldUpdate) /* The languages for a city get updated if a any
                                                                       language of the city is:
                                                                          * older than MAX_CONTENT_AGE,
                                                                          * has no "lastUpdate" or
                                                                          * an update is forced
                                                                        This means the loading of languages depends on
                                                                        language AND the city */
      const languages = yield call(dataContainer.getLanguages, newCity)

      const pushLanguages: PushLanguagesActionType = { type: 'PUSH_LANGUAGES', params: { languages } }
      yield put(pushLanguages)

      if (!languages.map(language => language.code).includes(newLanguage)) {
        return false
      }
    } catch (e) {
      console.error(e)
      const languagesFailed: FetchLanguagesFailedActionType = {
        type: 'FETCH_LANGUAGES_FAILED',
        params: {
          message: `Error in fetchCategory: ${e.message}`,
          code: fromError(e)
        }
      }
      yield put(languagesFailed)
    }
  }

  const [categoriesMap, events] = yield all([
    call(loadCategories, newCity, newLanguage, dataContainer, shouldUpdate),
    call(loadEvents, newCity, newLanguage, cityModel.eventsEnabled, dataContainer, shouldUpdate)
  ])

  const netInfo = yield call(NetInfo.fetch)
  const isCellularConnection = netInfo.type === 'cellular'

  // fetchResourceCache should be callable independent of content updates. Even if loadCategories, loadEvents,
  // loadLanguages did not update the dataContainer this is needed. In case the previous call to fetchResourceCache
  // failed to download some resources an other call could fix this and download missing files.
  if (criterion.shouldRefreshResources() && !isCellularConnection) {
    const resourceURLFinder = new ResourceURLFinder(buildConfig().allowedHostNames)
    resourceURLFinder.init()

    const fetchMap = resourceURLFinder.buildFetchMap(
      categoriesMap.toArray().concat(events),
      (url, urlHash) => buildResourceFilePath(url, newCity, urlHash)
    )

    resourceURLFinder.finalize()
    yield call(fetchResourceCache, newCity, newLanguage, fetchMap, dataContainer)
  }

  if (shouldUpdate) {
    yield call(dataContainer.setLastUpdate, newCity, newLanguage, moment())
  }

  return true
}
