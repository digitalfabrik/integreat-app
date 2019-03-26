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
import findResourcesFromHtml from '../findResourcesFromHtml'
import fnv from 'fnv-plus'
import { getResourceCacheFilesDirPath } from '../../platform/constants/webview.ios'
import getExtension from '../getExtension'
import type { ResourceCacheStateType } from '../../app/StateType'

function * fetchEvents (city: string, language: string): Saga<?Array<EventModel>> {
  const params = {city, language}

  const categoriesPayload: Payload<Array<EventModel>> = yield call(() => request(createEventsEndpoint(baseUrl), params))
  return categoriesPayload.data
}

function * loadEvents (city: string, language: string): Saga<[Array<EventModel>, ResourceCacheStateType]> {
  const events: ?Array<EventModel> = yield call(fetchEvents, city, language)

  if (!events) {
    throw new Error('Failed to load events!')
  }

  const urls = new Set([
    ...findResourcesFromHtml(events.map(event => event.content)),
    ...events.map(event => event.thumbnail).filter(thumbnail => !!thumbnail)
  ])

  const resourceCache = [...urls].reduce((acc, url) => {
    const hash = fnv.hash(url).hex()
    acc[url] = `${getResourceCacheFilesDirPath(city)}/${hash}.${getExtension(url)}`
    return acc
  }, {})

  return [events, resourceCache]
}

export default loadEvents
