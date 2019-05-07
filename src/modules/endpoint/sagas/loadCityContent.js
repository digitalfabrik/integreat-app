// @flow

import type { Saga } from 'redux-saga'
import { all, call } from 'redux-saga/effects'
import type { DataContainer } from '../DataContainer'
import loadLanguages from './loadLanguages'
import loadCategories from './loadCategories'
import loadEvents from './loadEvents'
import fetchResourceCache from './fetchResourceCache'
import moment from 'moment-timezone'

const MAX_CONTENT_AGE = 24

export default function * loadCityContent (
  dataContainer: DataContainer, newCity: string, newLanguage: string, forceUpdate: boolean): Saga<void> {
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

  const [categoryUrls, eventUrls] = yield all([
    call(loadCategories, newCity, newLanguage, dataContainer, shouldUpdate),
    call(loadEvents, newCity, newLanguage, dataContainer, shouldUpdate),
    call(loadLanguages, newCity, dataContainer, shouldUpdate)
  ])

  const fetchMap = {...categoryUrls, ...eventUrls}
  yield call(fetchResourceCache, newCity, newLanguage, fetchMap, dataContainer)

  if (shouldUpdate) {
    yield call(dataContainer.setLastUpdate, moment.tz('UTC'))
  }
}
