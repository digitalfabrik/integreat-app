// @flow

import type { Saga } from 'redux-saga'
import { all, call } from 'redux-saga/effects'
import MemoryDatabase from '../MemoryDatabase'
import MemoryDatabaseContext from '../MemoryDatabaseContext'
import loadLanguages from './loadLanguages'
import loadCategories from './loadCategories'
import loadEvents from './loadEvents'
import fetchResourceCache from './fetchResourceCache'

export default function * loadCityContent (database: MemoryDatabase, newCity: string, newLanguage: string): Saga<void> {
  if (database.hasContext(new MemoryDatabaseContext(newCity, newLanguage))) {
    return // All data is already in the database
  }

  database.changeContext(new MemoryDatabaseContext(newCity, newLanguage))

  const [categoryUrls, eventUrls] = yield all([
    call(loadCategories, newCity, newLanguage, database),
    call(loadEvents, newCity, newLanguage, database),
    call(loadLanguages, newCity, database)
  ])

  const fetchMap = {...categoryUrls, ...eventUrls}
  yield call(fetchResourceCache, newCity, newLanguage, fetchMap, database)
}
