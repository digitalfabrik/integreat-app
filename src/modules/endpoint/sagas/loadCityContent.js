// @flow

import type { Saga } from 'redux-saga'
import { all, call } from 'redux-saga/effects'
import type { DataContainer } from '../DataContainer'
import loadLanguages from './loadLanguages'
import loadCategories from './loadCategories'
import loadEvents from './loadEvents'
import fetchResourceCache from './fetchResourceCache'

export default function * loadCityContent (dataContainer: DataContainer, newCity: string, newLanguage: string): Saga<void> {
  yield call(dataContainer.setContext, newCity, newLanguage)

  const [categoryUrls, eventUrls] = yield all([
    call(loadCategories, newCity, newLanguage, dataContainer),
    call(loadEvents, newCity, newLanguage, dataContainer),
    call(loadLanguages, newCity, dataContainer)
  ])

  const fetchMap = {...categoryUrls, ...eventUrls}
  yield call(fetchResourceCache, newCity, newLanguage, fetchMap, dataContainer)
}
