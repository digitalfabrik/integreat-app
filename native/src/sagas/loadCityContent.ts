import NetInfo from '@react-native-community/netinfo'
import moment from 'moment'
import { all, call, put, SagaGenerator, spawn } from 'typed-redux-saga'

import { CategoriesMapModel, CategoryModel, EventModel, fromError, NotFoundError } from 'api-client'

import buildConfig from '../constants/buildConfig'
import { ContentLoadCriterion } from '../models/ContentLoadCriterion'
import { FetchLanguagesFailedActionType, PushLanguagesActionType } from '../redux/StoreActionType'
import appSettings from '../utils/AppSettings'
import { DataContainer } from '../utils/DataContainer'
import * as NotificationsManager from '../utils/PushNotificationsManager'
import ResourceURLFinder from '../utils/ResourceURLFinder'
import buildResourceFilePath from '../utils/buildResourceFilePath'
import { getErrorMessage } from '../utils/helpers'
import { log, reportError } from '../utils/sentry'
import fetchResourceCache from './fetchResourceCache'
import loadCategories from './loadCategories'
import loadCities from './loadCities'
import loadEvents from './loadEvents'
import loadLanguages from './loadLanguages'
import loadPois from './loadPois'

/**
 * Subscribes to the push notification topic of the new city and language
 * @param newCity
 * @param newLanguage
 */
function* subscribePushNotifications(newCity: string, newLanguage: string): SagaGenerator<void> {
  const settings = yield* call(appSettings.loadSettings)

  if (settings.allowPushNotifications) {
    const status = yield* call(NotificationsManager.requestPushNotificationPermission)

    if (status) {
      yield* call(NotificationsManager.subscribeNews, newCity, newLanguage)
    } else {
      // Disable the feature to prevent the user from being asked again
      yield* call(appSettings.setSettings, {
        allowPushNotifications: false,
      })
    }
  }
}

/**
 * Persists the newCity as selected city and subscribes to the corresponding push notifications.
 * @param newCity
 * @param newLanguage
 */
function* selectCity(newCity: string, newLanguage: string): SagaGenerator<void> {
  yield* call(appSettings.setSelectedCity, newCity)
  yield* spawn(subscribePushNotifications, newCity, newLanguage)
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
): SagaGenerator<void> {
  const resourceURLFinder = new ResourceURLFinder(buildConfig().allowedHostNames)
  resourceURLFinder.init()
  const input = (categoriesMap.toArray() as Array<CategoryModel | EventModel>).concat(events).map(it => ({
    path: it.path,
    thumbnail: it.thumbnail,
    content: it.content,
  }))
  const fetchMap = resourceURLFinder.buildFetchMap(input, (url, urlHash) =>
    buildResourceFilePath(url, newCity, urlHash)
  )
  resourceURLFinder.finalize()
  yield* call(fetchResourceCache, newCity, newLanguage, fetchMap, dataContainer)
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
): SagaGenerator<boolean> {
  try {
    yield* call(loadLanguages, newCity, dataContainer, shouldUpdate)
    const languages = yield* call(dataContainer.getLanguages, newCity)
    const pushLanguages: PushLanguagesActionType = {
      type: 'PUSH_LANGUAGES',
      params: {
        languages,
      },
    }
    yield* put(pushLanguages)
    return languages.map(language => language.code).includes(newLanguage)
  } catch (e) {
    reportError(e)
    const languagesFailed: FetchLanguagesFailedActionType = {
      type: 'FETCH_LANGUAGES_FAILED',
      params: {
        message: `Error while fetching languages: ${getErrorMessage(e)}`,
        code: fromError(e),
      },
    }
    yield* put(languagesFailed)
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
): SagaGenerator<boolean> {
  yield* call(dataContainer.storeLastUsage, newCity, criterion.peeking())

  if (!criterion.peeking()) {
    yield* call(selectCity, newCity, newLanguage)
  }

  const lastUpdate = yield* call(dataContainer.getLastUpdate, newCity, newLanguage)
  log(`Last city content update: ${lastUpdate ? lastUpdate.toISOString() : 'never'}`)
  const netInfo = yield* call(NetInfo.fetch)
  const shouldUpdate = criterion.shouldUpdate(lastUpdate)
  log(`City content should be refreshed: ${shouldUpdate}`)
  // Temporarily set lastUpdate to "now" to hinder other threads from trying to update content and
  // resources at the same time. This kind of serves as a lock.
  yield* call(dataContainer.setLastUpdate, newCity, newLanguage, moment())

  try {
    // Refresh for flags like eventsEnabled necessary
    const cities = yield* call(loadCities, dataContainer, shouldUpdate)

    const cityModel = cities.find(city => city.code === newCity)

    if (!cityModel) {
      throw new NotFoundError({ type: 'city', id: newCity, city: newCity, language: newLanguage })
    }

    if (criterion.shouldLoadLanguages()) {
      const languageAvailable = yield* call(prepareLanguages, dataContainer, newCity, newLanguage, shouldUpdate)

      if (!languageAvailable) {
        return false
      }
    }

    const { featureFlags } = buildConfig()
    const { categoriesMap, events, _unusedPois } = yield* all({
      categoriesMap: call(loadCategories, newCity, newLanguage, dataContainer, shouldUpdate),
      events: call(loadEvents, newCity, newLanguage, cityModel.eventsEnabled, dataContainer, shouldUpdate),
      _unusedPois: call(loadPois, newCity, newLanguage, featureFlags.pois, dataContainer, shouldUpdate),
    })

    // fetchResourceCache should be callable independent of content updates. Even if loadCategories, loadEvents,
    // loadLanguages did not update the dataContainer this is needed. In case the previous call to fetchResourceCache
    // failed to download some resources an other call could fix this and download missing files.
    if (criterion.shouldRefreshResources() && netInfo.type !== 'cellular') {
      yield* call(refreshResources, dataContainer, categoriesMap, events, newCity, newLanguage)
    }

    if (!shouldUpdate && lastUpdate) {
      yield* call(dataContainer.setLastUpdate, newCity, newLanguage, lastUpdate)
    } else {
      yield* call(dataContainer.setLastUpdate, newCity, newLanguage, moment())
    }

    return true
  } catch (e) {
    // If any error occurs, we have to store the old value for lastUpdate again
    if (lastUpdate) {
      yield* call(dataContainer.setLastUpdate, newCity, newLanguage, lastUpdate)
    }

    throw e
  }
}
