// @flow

import type { Saga } from 'redux-saga'
import { createEventsEndpoint, EventModel, Payload } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import request from '../request'
import { baseUrl } from '../constants'
import type { FetchMapType } from './fetchResourceCache'
import type { DataContainer } from '../DataContainer'
import DatabaseContext from '../DatabaseContext'

function * fetchEvents (city: string, language: string): Saga<Array<EventModel>> {
  const params = {city, language}

  const categoriesPayload: Payload<Array<EventModel>> = yield call(() => request(createEventsEndpoint(baseUrl), params))
  return categoriesPayload.data
}

function * loadEvents (
  city: string, language: string, dataContainer: DataContainer, shouldUpdate: boolean
): Saga<FetchMapType> {
  const context = new DatabaseContext(city, language)

  if (!dataContainer.eventsAvailable(context) || shouldUpdate) {
    // data is already loaded and should not be updated

    console.debug('Fetching events')

    // TODO: if data was loaded but should be updated incrementally. This will be done in NATIVE-3

    const events = yield call(fetchEvents, city, language)

    yield call(dataContainer.setEvents, context, events)
    return events
  }

  console.debug('Using cached events')
  return yield call(dataContainer.getEvents, context)
}

export default loadEvents
