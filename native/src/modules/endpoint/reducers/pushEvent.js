// @flow

import type { CityContentStateType, EventRouteStateType } from '../../app/StateType'
import type { PushEventActionType } from '../../app/StoreActionType'
import { EventModel } from 'api-client'

const pushEvent = (state: CityContentStateType, action: PushEventActionType): CityContentStateType => {
  const { events, path, key, language, resourceCache, cityLanguages, city } = action.params

  if (!key) {
    throw new Error('You need to specify a key!')
  }

  const getEventRoute = (): EventRouteStateType => {
    if (!path) {
      const allAvailableLanguages = new Map(cityLanguages.map(lng => [lng.code, null]))
      return { status: 'ready', path: null, models: events, allAvailableLanguages, language, city }
    }
    const event: ?EventModel = events.find(event => event.path === path)
    if (!event) {
      throw new Error(`Event with path ${path} was not found in supplied models.`)
    }
    const allAvailableLanguages = new Map(event.availableLanguages)
    allAvailableLanguages.set(language, path)

    return {
      status: 'ready',
      path,
      models: [event],
      allAvailableLanguages,
      language,
      city
    }
  }

  // If there is an error in the old resourceCache, we want to override it
  const newResourceCache = state.resourceCache.status === 'ready'
    ? { ...state.resourceCache.value, ...resourceCache }
    : resourceCache

  return {
    ...state,
    eventsRouteMapping: { ...state.eventsRouteMapping, [key]: getEventRoute() },
    resourceCache: { status: 'ready', value: newResourceCache }
  }
}

export default pushEvent
