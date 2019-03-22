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

  yield all([
    call(loadLanguages, database, newCity, newLanguage),
    call(loadCategories, database, newCity, newLanguage),
    call(loadEvents, database, newCity, newLanguage)
  ])

  yield call(fetchResourceCache, newCity, newLanguage, {
    ...database.eventsResourceCache,
    ...database.categoriesResourceCache
  })

  // todo: persist database

  // todo: dispatch action to notify state about switching to new instance (e.g. for switching language)
}
