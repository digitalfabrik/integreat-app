// @flow

import type { Saga } from 'redux-saga'
import { all, call } from 'redux-saga/effects'
import type { DataContainer } from '../DataContainer'
import loadLanguages from './loadLanguages'
import loadCategories from './loadCategories'
import loadEvents from './loadEvents'
import fetchResourceCache from './fetchResourceCache'
import moment from 'moment-timezone'

const TWENTY_FOUR_HOURS = 24

export default function * loadCityContent (
  dataContainer: DataContainer, newCity: string, newLanguage: string, forceRefresh: boolean): Saga<void> {
  yield call(dataContainer.setContext, newCity, newLanguage)

  console.debug('Last city content update on ',
    dataContainer.lastUpdate ? dataContainer.lastUpdate.toISOString() : dataContainer.lastUpdate)

  // The last update was more than 24h ago or a refresh should be forced
  const shouldUpdate = forceRefresh || !dataContainer.lastUpdate ||
    dataContainer.lastUpdate.isBefore(moment.tz('UTC').subtract(TWENTY_FOUR_HOURS, 'hours'))

  console.debug('City content should be refreshed: ', shouldUpdate)

  const [categoryUrls, eventUrls] = yield all([
    call(loadCategories, newCity, newLanguage, dataContainer, shouldUpdate),
    call(loadEvents, newCity, newLanguage, dataContainer, shouldUpdate),
    call(loadLanguages, newCity, dataContainer, shouldUpdate)
  ])

  const fetchMap = {...categoryUrls, ...eventUrls}
  yield call(fetchResourceCache, newCity, newLanguage, fetchMap, dataContainer)

  if (shouldUpdate) {
    dataContainer.lastUpdate = moment.tz('UTC')
    yield call(dataContainer.writeLastUpdate)
  }
  yield call(fetchResourceCache, newCity, newLanguage, fetchMap, dataContainer)
}
