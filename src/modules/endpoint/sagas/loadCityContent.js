// @flow

import type { Saga } from 'redux-saga'
import { all, call } from 'redux-saga/effects'
import MemoryDatabase from '../MemoryDatabase'
import MemoryDatabaseContext from '../MemoryDatabaseContext'
import loadLanguages from './loadLanguages'
import loadCategories from './loadCategories'
import loadEvents from './loadEvents'
import fetchResourceCache from './fetchResourceCache'
import type { ResourceCacheType } from '../ResourceCacheType'

export default function * loadCityContent (database: MemoryDatabase, newCity: string, newLanguage: string): Saga<void> {
  if (database.hasContext(new MemoryDatabaseContext(newCity, newLanguage))) {
    return // All data is already in the database
  }

  database.changeContext(new MemoryDatabaseContext(newCity, newLanguage))

  const [[categoriesMap, categoryUrls], [events, eventUrls], languages] = yield all([
    call(loadCategories, newCity, newLanguage),
    call(loadEvents, newCity, newLanguage),
    call(loadLanguages, newCity, newLanguage)
  ])

  database.events = events
  database.categoriesMap = categoriesMap
  database.languages = languages

  const resourceCache: ResourceCacheType = yield call(fetchResourceCache, newCity, newLanguage, {
    ...categoryUrls,
    ...eventUrls
  })

  database.addCacheEntries(resourceCache)

  yield call(() => database.writeCategories())
  yield call(() => database.writeResourceCache())
  yield call(() => database.readCategories())
  yield call(() => database.readResourceCache())
}
