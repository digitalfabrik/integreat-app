// @flow

import type { Saga } from 'redux-saga'
import { EventModel, createEventsEndpoint } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import { baseUrl } from '../constants'
import type { DataContainer } from '../DataContainer'

function * loadEvents (
  city: string,
  language: string,
  dataContainer: DataContainer,
  forceRefresh: boolean
): Saga<Array<EventModel>> {
  const eventsAvailable = yield call(() => dataContainer.eventsAvailable(city, language))

  if (!eventsAvailable || forceRefresh) {
    console.debug('Fetching events')

    const payload = yield call(() => createEventsEndpoint(baseUrl).request({ city, language }))
    const events: Array<EventModel> = payload.data

    yield call(dataContainer.setEvents, city, language, events)
    return events
  }

  console.debug('Using cached events')
  return yield call(dataContainer.getEvents, city, language)
}

export default loadEvents
