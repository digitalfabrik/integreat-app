// @flow

import type { Saga } from 'redux-saga'
import {
  createEventsEndpoint,
  EventModel,
  Payload
} from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import request from '../request'
import { baseUrl } from '../constants'
import ResourceURLFinder from '../ResourceURLFinder'
import buildResourceFilePath from '../buildResourceFilePath'
import type { FetchMapType } from './fetchResourceCache'
import type { DataContainer } from '../DataContainer'

function * fetchEvents (city: string, language: string): Saga<Array<EventModel>> {
  const params = {city, language}

  const categoriesPayload: Payload<Array<EventModel>> = yield call(() => request(createEventsEndpoint(baseUrl), params))
  return categoriesPayload.data
}

function * loadEvents (
  city: string, language: string, dataContainer: DataContainer, shouldUpdate: boolean): Saga<FetchMapType> {
  let events: Array<EventModel>

  if (!dataContainer.eventsAvailable() || shouldUpdate) {
    // data is already loaded and should not be updated

    console.debug('Fetching events')

    // TODO: if data was loaded but should be updated incrementally. This will be done in NATIVE-3

    events = yield call(fetchEvents, city, language)

    yield call(dataContainer.setEvents, events)
  } else {
    console.debug('Using cached events')

    events = yield call(dataContainer.getEvents)
  }

  const resourceURLFinder = new ResourceURLFinder()
  resourceURLFinder.init()

  const urls = resourceURLFinder.buildFetchMap(
    events,
    (url, path) => buildResourceFilePath(url, path, city)
  )

  resourceURLFinder.finalize()

  return urls
}

export default loadEvents
