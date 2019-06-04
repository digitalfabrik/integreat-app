// @flow

import type { Saga } from 'redux-saga'
import { all, call, put } from 'redux-saga/effects'
import type { DataContainer } from '../DataContainer'
import loadCategories from './loadCategories'
import loadEvents from './loadEvents'
import fetchResourceCache from './fetchResourceCache'
import moment from 'moment-timezone'
import type { PushLanguagesActionType, SetCityContentLocalizationType } from '../../app/StoreActionType'
import loadLanguages from './loadLanguages'

const MAX_CONTENT_AGE = 24

export default function * loadCityContent (
  dataContainer: DataContainer, newCity: string, newLanguage: string, forceUpdate: boolean): Saga<void> {
  yield call(dataContainer.setContext, newCity, newLanguage)

  const setCityContentLocalization: SetCityContentLocalizationType = {
    type: 'SET_CITY_CONTENT_LOCALIZATION',
    params: {
      city: newCity,
      language: newLanguage
    }
  }

  yield put(setCityContentLocalization)

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

  yield call(loadLanguages, newCity, dataContainer, shouldUpdate)
  const languages = yield call(dataContainer.getLanguages)

  const pushLanguages: PushLanguagesActionType = {
    type: 'PUSH_LANGUAGES',
    params: {
      languages
    }
  }
  yield put(pushLanguages)

  if (languages.map(language => language.code).includes(newLanguage)) {
    const [categoryUrls, eventUrls] = yield all([
      call(loadCategories, newCity, newLanguage, dataContainer, shouldUpdate),
      call(loadEvents, newCity, newLanguage, dataContainer, shouldUpdate)
    ])

    if (shouldUpdate) {
      const fetchMap = {...categoryUrls, ...eventUrls}
      yield call(fetchResourceCache, newCity, newLanguage, fetchMap, dataContainer)
      yield call(dataContainer.setLastUpdate, moment.tz('UTC'))
    }
  } else {
    throw new Error('Language is not available')
  }
}
