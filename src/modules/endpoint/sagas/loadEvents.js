// @flow

import type { Saga } from 'redux-saga'
import { createEventsEndpoint, EventModel } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import type { DataContainer } from '../DataContainer'
import determineApiUrl from '../determineApiUrl'

function * loadEvents (
  city: string,
  language: string,
  dataContainer: DataContainer,
  forceRefresh: boolean
): Saga<Array<EventModel>> {
  const eventsAvailable = yield call(() => dataContainer.eventsAvailable(city, language))

  if (eventsAvailable && !forceRefresh) {
    try {
      console.debug('Using cached events')
      return yield call(dataContainer.getEvents, city, language)
    } catch (e) {
      console.warn('An error occurred while loading events from JSON', e)
    }
  }

  console.debug('Fetching events')

  const apiUrl = yield call(determineApiUrl)
  const payload = yield call(() => createEventsEndpoint(apiUrl).request({ city, language }))
  const events: Array<EventModel> = payload.data

  yield call(dataContainer.setEvents, city, language, events)
  return events
}

export default loadEvents
