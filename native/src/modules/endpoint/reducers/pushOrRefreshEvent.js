// @flow

import type { CityContentStateType, EventRouteStateType } from '../../app/StateType'
import type { PushEventActionType, RefreshEventActionType } from '../../app/StoreActionType'
import { EventModel } from '@integreat-app/integreat-api-client'
import ErrorCodes from '../../error/ErrorCodes'

const pushOrRefreshEvent = (state: CityContentStateType,
  action: PushEventActionType | RefreshEventActionType): CityContentStateType => {
  const type = action.type
  const { events, path, key, language, resourceCache, cityLanguages, city } = action.params

  if (!key) {
    throw new Error('You need to specify a key!')
  }

  // If there is an error in the old resourceCache, we want to override it
  const newResourceCache = state.resourceCache.status === 'ready'
    ? { ...state.resourceCache.value, ...resourceCache }
    : resourceCache

  const getEventRoute = (currentPath: ?string): EventRouteStateType => {
    // Check whether another page in the same city is loading, e.g. because it is being refreshed.
    // This is important for displaying the loading spinner.
    const otherEventPageLoading = Object.values(state.eventsRouteMapping)
      // $FlowFixMe Flow does not support Object.values
      .filter(route => city === route.city && currentPath !== route.path && language === route.language)
      // $FlowFixMe Flow does not support Object.values
      .some(route => route.status === 'loading')

    const status = (otherEventPageLoading && type === 'PUSH_EVENT') ? 'loading' : 'ready'
    if (!currentPath) {
      const allAvailableLanguages = new Map(cityLanguages.map(lng => [lng.code, null]))
      // $FlowFixMe Flow can't evaluate the status as it is dynamic
      return {
        status,
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
        message: `Could not find an event with path '${path}'.`,
        code: ErrorCodes.PageNotFound
      }
    }
    const allAvailableLanguages = new Map(event.availableLanguages)
    allAvailableLanguages.set(language, currentPath)
    // $FlowFixMe Flow can't evaluate the status as it is dynamic
    return {
      status,
      path: currentPath,
      models: [event],
      allAvailableLanguages,
      language,
      city
    }
  }

  if (type === 'REFRESH_EVENT') {
    Object.entries(state.eventsRouteMapping)
      // $FlowFixMe Object.entries does not supply proper types
      .filter(([key, route]) => city === route.city && path !== route.path && language === route.language)
      .forEach(([key:string, route]) => {
        // $FlowFixMe Object.entries does not supply proper types
        console.log('route path', route.path)
        state.eventsRouteMapping[key] = getEventRoute(route.path)
      })
  }

  return {
    ...state,
    eventsRouteMapping: {
      ...state.eventsRouteMapping,
      [key]: getEventRoute(path)
    },
    resourceCache: {
      status: 'ready',
      value: newResourceCache
    }
  }
}

export default pushOrRefreshEvent
