// @flow

import type { Saga } from 'redux-saga'
import MemoryDatabase from '../MemoryDatabase'
import { CategoriesMapModel, createEventsEndpoint, EventModel } from '@integreat-app/integreat-api-client'
import { call } from 'redux-saga/effects'
import request from '../request'
import { baseUrl } from '../constants'
import findResourcesFromHtml from '../findResourcesFromHtml'
import fnv from 'fnv-plus'
import { OFFLINE_CACHE_PATH } from '../../platform/constants/webview.ios'
import getExtension from '../getExtension'
import type { ResourceCacheStateType } from '../../app/StateType'

function * fetchEvents (city: string, language: string): Saga<CategoriesMapModel> {
  const params = {city, language}

  const categoriesPayload = yield call(() => request(createEventsEndpoint(baseUrl), params))
  return categoriesPayload.data
}

function * loadEvents (database: MemoryDatabase, city: string, language: string): Saga<ResourceCacheStateType> {
  const events: Array<EventModel> = yield call(fetchEvents, city, language)

  const urls = new Set([
    ...findResourcesFromHtml(events.map(event => event.content)),
    ...events.map(event => event.thumbnail).filter(thumbnail => !!thumbnail)
  ])

  const resourceCache = [...urls].reduce((acc, url) => {
    const hash = fnv.hash(url).hex()
    acc[url] = `${OFFLINE_CACHE_PATH}/${city}/${hash}.${getExtension(url)}`
    return acc
  }, {})

  database.events = events

  return resourceCache
}

export default loadEvents
