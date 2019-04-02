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
import type { TargetFilePathsType } from '../../fetcher/FetcherModule'

function * fetchEvents (city: string, language: string): Saga<?Array<EventModel>> {
  const params = {city, language}

  const categoriesPayload: Payload<Array<EventModel>> = yield call(() => request(createEventsEndpoint(baseUrl), params))
  return categoriesPayload.data
}

function * loadEvents (city: string, language: string): Saga<[Array<EventModel>, TargetFilePathsType]> {
  const events: ?Array<EventModel> = yield call(fetchEvents, city, language)

  if (!events) {
    throw new Error('Failed to load events!')
  }

  return [events, {}]
}

export default loadEvents
