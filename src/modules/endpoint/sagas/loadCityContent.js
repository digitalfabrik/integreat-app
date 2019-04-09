// @flow

import type { Saga } from 'redux-saga'
import { all, call } from 'redux-saga/effects'
import MemoryDatabase from '../MemoryDatabase'
import MemoryDatabaseContext from '../MemoryDatabaseContext'
import loadLanguages from './loadLanguages'
import loadCategories from './loadCategories'
import loadEvents from './loadEvents'
import fetchResourceCache from './fetchResourceCache'
import moment from 'moment'

const TWENTY_FOUR_HOURS = 24

export default function * loadCityContent (
  database: MemoryDatabase, newCity: string, newLanguage: string, forceRefresh: boolean): Saga<void> {
  if (!database.hasContext(newCity, newLanguage)) {
    database.changeContext(new MemoryDatabaseContext(newCity, newLanguage))
  }

  yield call(database.readLastUpdate)

  // The last update was less than 24h ago and a refresh should not be forced
  if (!forceRefresh && database.lastUpdate &&
    database.lastUpdate.isAfter(moment().subtract(TWENTY_FOUR_HOURS, 'hours'))) {
    return
  }

  const [categoryUrls, eventUrls] = yield all([
    call(loadCategories, newCity, newLanguage, database),
    call(loadEvents, newCity, newLanguage, database),
    call(loadLanguages, newCity, database)
  ])

  const fetchMap = {...categoryUrls, ...eventUrls}
  yield call(fetchResourceCache, newCity, newLanguage, fetchMap, database)
}
