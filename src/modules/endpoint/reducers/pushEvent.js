// @flow

import type { CityContentStateType, EventRouteStateType } from '../../app/StateType'
import type { PushEventActionType } from '../../app/StoreActionType'
import { EventModel } from '@integreat-app/integreat-api-client'

const pushEvent = (state: CityContentStateType, action: PushEventActionType): CityContentStateType => {
  const { events, path, key, language, resourceCache, languages } = action.params

  if (!key) {
    throw new Error('You need to specify a key!')
  }

  const getEventRoute = (): EventRouteStateType => {
    if (!path) {
      return {
        path: null,
        models: events,
        allAvailableLanguages: new Map(languages.map(language => [language.code, language.code])),
        language
      }
    }
    const event: EventModel = events.find(event => event.path === path)
    const allAvailableLanguages = new Map(event.availableLanguages)
    allAvailableLanguages.set(language, path)

    return {
      path,
      models: [event],
      allAvailableLanguages,
      language
    }
  }

  // If there is an error in the old resourceCache, we want to override it
  const newResourceCache =
    state.resourceCache.errorMessage === undefined ? { ...state.resourceCache, ...resourceCache } : resourceCache

  // If there is an error in the old eventsRouteMapping, we want to override it
  const newEventsRouteMapping = state.eventsRouteMapping.errorMessage === undefined
    ? { ...state.eventsRouteMapping, [key]: getEventRoute() }
    : { [key]: getEventRoute() }

  return {
    ...state,
    eventsRouteMapping: newEventsRouteMapping,
    resourceCache: newResourceCache
  }
}

export default pushEvent
