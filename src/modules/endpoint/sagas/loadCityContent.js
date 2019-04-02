// @flow

import type { Saga } from 'redux-saga'
import { all, call } from 'redux-saga/effects'
import MemoryDatabase from '../MemoryDatabase'
import MemoryDatabaseContext from '../MemoryDatabaseContext'
import loadLanguages from './loadLanguages'
import loadCategories from './loadCategories'
import loadEvents from './loadEvents'
import fetchResourceCache from './fetchResourceCache'
import type { ResourceCacheStateType } from '../../app/StateType'

export default function * loadCityContent (database: MemoryDatabase, newCity: string, newLanguage: string): Saga<void> {
  if (database.hasContext(new MemoryDatabaseContext(newCity, newLanguage))) {
    return // All data is already in the database
  }

  database.changeContext(new MemoryDatabaseContext(newCity, newLanguage))

  const [[categoryUrls], [events, eventUrls], languages] = yield all([
    call(loadCategories, newCity, newLanguage, database),
    call(loadEvents, newCity, newLanguage),
    call(loadLanguages, newCity, newLanguage)
  ])

  database.events = events
  database.languages = languages
  console.log('categories map', database.categoriesMap)

  const resourceCache: ResourceCacheStateType = yield call(fetchResourceCache, newCity, newLanguage, {
    ...categoryUrls,
    ...eventUrls
  })

  database.addCacheEntries(resourceCache)

  // This is a test which should be removed when we do the intelligent loading in NATIVE-89
  // yield call(() => database.writeCategories())
  // yield call(() => database.writeResourceCache())
  // yield call(() => database.readCategories())
  // yield call(() => database.readResourceCache())
}
