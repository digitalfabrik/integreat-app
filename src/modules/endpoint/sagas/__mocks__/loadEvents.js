// @flow

import type { DataContainer } from '../../DataContainer'
import type { Saga } from 'redux-saga'
import { EventModel } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'

export default function * loadEvents (city: string, language: string, dataContainer: DataContainer, forceRefresh: boolean): Saga<Array<EventModel>> {
  const eventsAvailable = yield call(() => dataContainer.eventsAvailable(city, language))
  if (!eventsAvailable || forceRefresh) {
    if (city === 'augsburg' && language === 'en') {
      return yield call(dataContainer.getLanguages, city)
    } else {
      throw new Error('When using this mock you should prepare the DataContainer with "augsburg" and language "en"!')
    }
  }
  return yield call(dataContainer.getEvents, city, language)
}
