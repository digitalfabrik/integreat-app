// @flow

import type { CityContentStateType, EventRouteStateType } from '../../app/StateType'
import type { PushEventActionType } from '../../app/StoreActionType'
import { EventModel } from '@integreat-app/integreat-api-client'
import ErrorCodes from '../../error/ErrorCodes'

const refreshEvent = (state: CityContentStateType, action: PushEventActionType): CityContentStateType => {
  const { events, path, key, language, resourceCache, cityLanguages, city } = action.params

  if (!key) {
    throw new Error('You need to specify a key!')
  }

  const getEventRoute = (currentPath: ?string): EventRouteStateType => {
    if (!currentPath) {
      const allAvailableLanguages = new Map(cityLanguages.map(lng => [lng.code, null]))
      return {
        status: 'ready',
        path: null,
        models: events,
        allAvailableLanguages,
        language,
        city
      }
    }
    const event: ?EventModel = events.find(event => event.path === currentPath)
    if (!event) {
      return {
        path: currentPath,
        language,
        city,
        status: 'error',
        message: `Could not find an event with path '${currentPath}'.`,
        code: ErrorCodes.PageNotFound
      }
    }
    const allAvailableLanguages = new Map(event.availableLanguages)
    allAvailableLanguages.set(language, currentPath)

    return {
      status: 'ready',
      path: currentPath,
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

  Object.entries(state.eventsRouteMapping)
    .filter(([key, route]) => city === route.city && path !== route.path && language === route.language)
    .forEach(([key, route]) => {
      state.eventsRouteMapping[key] = getEventRoute(route.path)
    })

  return {
    ...state,
    eventsRouteMapping: {
      ...state.eventsRouteMapping,
      [key]: getEventRoute()
    },
    resourceCache: {
      status: 'ready',
      value: newResourceCache
    }

  }
}

export default refreshEvent
