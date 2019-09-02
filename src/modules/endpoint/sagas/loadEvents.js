// @flow

import type { Saga } from 'redux-saga'
import { createEventsEndpoint, EventModel, Payload } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import { baseUrl } from '../constants'
import type { FetchMapType } from './fetchResourceCache'
import type { DataContainer } from '../DataContainer'

function * fetchEvents (city: string, language: string): Saga<Array<EventModel>> {
  const params = { city, language }

  const categoriesPayload: Payload<Array<EventModel>> = yield call(() => createEventsEndpoint(baseUrl).request(params))
  return categoriesPayload.data
}

function * loadEvents (
  city: string, language: string, dataContainer: DataContainer, shouldUpdate: boolean
): Saga<FetchMapType> {
  const eventsAvailable = yield call(() => dataContainer.eventsAvailable(city, language))

  if (!eventsAvailable || shouldUpdate) {
    // data is already loaded and should not be updated

    console.debug('Fetching events')

    // TODO: if data was loaded but should be updated incrementally. This will be done in NATIVE-3

    const events = yield call(fetchEvents, city, language)

    yield call(dataContainer.setEvents, city, language, events)
    return events
  }

  console.debug('Using cached events')
  return yield call(dataContainer.getEvents, city, language)
}

export default loadEvents
