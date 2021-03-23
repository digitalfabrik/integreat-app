// @flow

import type { Saga } from 'redux-saga'
import { all, call, put, spawn } from 'redux-saga/effects'
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
import type { SettingsType } from '../../settings/AppSettings'
import AppSettings from '../../settings/AppSettings'
import NetInfo from '@react-native-community/netinfo'
import loadCities from './loadCities'
import { fromError } from '../../error/ErrorCodes'
import * as NotificationsManager from '../../push-notifications/PushNotificationsManager'
import buildConfig from '../../app/constants/buildConfig'
import loadPois from './loadPois'
import { CategoriesMapModel, EventModel } from 'api-client'

/**
 * Persists the newCity as selected city and subscribes to the corresponding push notifications.
 * @param newCity
 * @param newLanguage
 */
function* selectCity(newCity: string, newLanguage: string): Saga<void> {
  const appSettings = new AppSettings()
  const settings: SettingsType = yield call(appSettings.loadSettings)

  if (settings.allowPushNotifications) {
    yield spawn(NotificationsManager.subscribeNews, newCity, newLanguage, buildConfig().featureFlags)
  }

  yield call(appSettings.setSelectedCity, newCity)
}

/**
 * Downloads and refreshes resources linked and used in the categories and events
 * @param dataContainer
 * @param categoriesMap
 * @param events
 * @param newCity
 * @param newLanguage
 */
function* refreshResources(
  dataContainer: DataContainer,
  categoriesMap: CategoriesMapModel,
  events: Array<EventModel>,
  newCity: string,
  newLanguage: string
): Saga<void> {
  const resourceURLFinder = new ResourceURLFinder(buildConfig().allowedHostNames)
  resourceURLFinder.init()

  const input = categoriesMap
    .toArray()
    .concat(events)
    .map(it => ({ path: it.path, thumbnail: it.thumbnail, content: it.content }))
  const fetchMap = resourceURLFinder.buildFetchMap(input, (url, urlHash) =>
    buildResourceFilePath(url, newCity, urlHash)
  )

  resourceURLFinder.finalize()
  yield call(fetchResourceCache, newCity, newLanguage, fetchMap, dataContainer)
}

/**
 * Loads the languages of newCity and pushes them to the redux store.
 * @param dataContainer
 * @param newCity
 * @param newLanguage
 * @param shouldUpdate
 * @returns Whether newLanguage is a valid language of the newCity.
 */
function* prepareLanguages(
  dataContainer: DataContainer,
  newCity: string,
  newLanguage: string,
  shouldUpdate: boolean
): Saga<boolean> {
  try {
    yield call(loadLanguages, newCity, dataContainer, shouldUpdate)
    const languages = yield call(dataContainer.getLanguages, newCity)

    const pushLanguages: PushLanguagesActionType = {
      type: 'PUSH_LANGUAGES',
      params: { languages }
    }
    yield put(pushLanguages)

    return languages.map(language => language.code).includes(newLanguage)
  } catch (e) {
    console.error(e)
    const languagesFailed: FetchLanguagesFailedActionType = {
      type: 'FETCH_LANGUAGES_FAILED',
      params: {
        message: `Error in fetchCategoryhttps://en.wikipedia.org/wiki/Serbian_language: ${e.message}`,
        code: fromError(e)
      }
    }
    yield put(languagesFailed)
    return false
  }
}

/**
 *
 * @param dataContainer
 * @param newCity
 * @param newLanguage
 * @param criterion
 * @returns Returns a saga which returns whether the newLanguage is available for newCity
 * @throws if the saga was unable to load necessary data
 */
export default function* loadCityContent(
  dataContainer: DataContainer,
  newCity: string,
  newLanguage: string,
  criterion: ContentLoadCriterion
): Saga<boolean> {
  yield call(dataContainer.storeLastUsage, newCity, criterion.peeking())

  if (!criterion.peeking()) {
    yield call(selectCity, newCity, newLanguage)
  }

  const lastUpdate: Moment | null = yield call(dataContainer.getLastUpdate, newCity, newLanguage)
  console.debug('Last previous city content update: ', lastUpdate ? lastUpdate.toISOString() : 'never')

  const netInfo = yield call(NetInfo.fetch)
  const shouldUpdate = criterion.shouldUpdate(lastUpdate)
  console.debug('City content should be refreshed: ', shouldUpdate)

  // Temporarily set lastUpdate to "now" to hinder other threads from trying to update content and
  // resources at the same time. This kind of serves as a lock.
  yield call(dataContainer.setLastUpdate, newCity, newLanguage, moment())

  try {
    const cities = yield call(loadCities, dataContainer, shouldUpdate) // Refresh for flags like eventsEnabled necessary
    const cityModel = cities.find(city => city.code === newCity)
    if (!cityModel) {
      throw new Error(`City '${newCity}' was not found.`)
    }

    if (criterion.shouldLoadLanguages()) {
      const languageAvailable = yield call(prepareLanguages, dataContainer, newCity, newLanguage, shouldUpdate)
      if (!languageAvailable) {
        return false
      }
    }

    const { featureFlags } = buildConfig()
    const [categoriesMap, events] = yield all([
      call(loadCategories, newCity, newLanguage, dataContainer, shouldUpdate),
      call(loadEvents, newCity, newLanguage, cityModel.eventsEnabled, dataContainer, shouldUpdate),
      call(loadPois, newCity, newLanguage, featureFlags.pois, dataContainer, shouldUpdate)
    ])

    // fetchResourceCache should be callable independent of content updates. Even if loadCategories, loadEvents,
    // loadLanguages did not update the dataContainer this is needed. In case the previous call to fetchResourceCache
    // failed to download some resources an other call could fix this and download missing files.
    if (criterion.shouldRefreshResources() && netInfo.type !== 'cellular') {
      yield call(refreshResources, dataContainer, categoriesMap, events, newCity, newLanguage)
    }

    if (!shouldUpdate && lastUpdate) {
      yield call(dataContainer.setLastUpdate, newCity, newLanguage, lastUpdate)
    } else {
      yield call(dataContainer.setLastUpdate, newCity, newLanguage, moment())
    }

    return true
  } catch (e) {
    // If any error occurs, we have to store the old value for lastUpdate again
    if (lastUpdate) {
      yield call(dataContainer.setLastUpdate, newCity, newLanguage, lastUpdate)
    }
    throw e
  }
}
