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
import MemoryDatabase from '../MemoryDatabase'

function * fetchEvents (city: string, language: string): Saga<?Array<EventModel>> {
  const params = {city, language}

  const categoriesPayload: Payload<Array<EventModel>> = yield call(() => request(createEventsEndpoint(baseUrl), params))
  return categoriesPayload.data
}

function * loadEvents (city: string, language: string, database: MemoryDatabase): Saga<FetchMapType> {
  yield call(database.readEvents)

  if (database.events) {
    console.log('Found events on hard disk')
    return {}
  }

  const events: ?Array<EventModel> = yield call(fetchEvents, city, language)

  if (!events) {
    throw new Error('Failed to load events!')
  }

  const resourceURLFinder = new ResourceURLFinder()
  resourceURLFinder.init()

  const urls = resourceURLFinder.buildFetchMap(
    events,
    (url, path) => buildResourceFilePath(url, path, city)
  )

  resourceURLFinder.finalize()

  database.events = events
  console.log('Writing events to hard disk')
  yield call(database.writeEvents)

  return urls
}

export default loadEvents
