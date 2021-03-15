// @flow

import type { CityContentStateType, EventRouteStateType, RouteStateType } from '../../app/StateType'
import type { PushEventActionType } from '../../app/StoreActionType'
import { EventModel, EVENTS_ROUTE } from 'api-client'
import ErrorCodes from '../../error/ErrorCodes'
import { values, entries } from 'translations'

const getEventRouteState = (
  currentPath: ?string,
  state: CityContentStateType,
  action: PushEventActionType
): EventRouteStateType => {
  const { events, language, cityLanguages, city, refresh } = action.params

  // Check whether another page in the same city is loading, e.g. because it is being refreshed.
  // This is important for displaying the loading spinner.
  const otherEventPageLoading = values<RouteStateType>(state.routeMapping)
    .filter(route => route.routeType === EVENTS_ROUTE &&
      city === route.city &&
      currentPath !== route.path &&
      language === route.language)
    .some(route => route.status === 'loading')

  const status: 'loading' | 'ready' = otherEventPageLoading && !refresh ? 'loading' : 'ready'
  if (!currentPath) {
    const allAvailableLanguages = new Map(cityLanguages.map(lng => [lng.code, null]))
    const eventRouteState = {
      routeType: EVENTS_ROUTE,
      path: null,
      language,
      city,
      models: events,
      allAvailableLanguages
    }
    if (status === 'loading') {
      return { routeType: EVENTS_ROUTE, status: 'loading', ...eventRouteState }
    } else {
      return { routeType: EVENTS_ROUTE, status: 'ready', ...eventRouteState }
    }
  }
  const event: ?EventModel = events.find(event => event.path === currentPath)
  if (!event) {
    return {
      routeType: EVENTS_ROUTE,
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

  const eventRouteState = {
    path: currentPath,
    models: [event],
    allAvailableLanguages,
    language,
    city
  }

  if (status === 'loading') {
    return { routeType: EVENTS_ROUTE, status: 'loading', ...eventRouteState }
  } else {
    return { routeType: EVENTS_ROUTE, status: 'ready', ...eventRouteState }
  }
}

const pushEvent = (state: CityContentStateType, action: PushEventActionType): CityContentStateType => {
  const { path, key, language, resourceCache, city, refresh } = action.params

  // If there is an error in the old resourceCache, we want to override it
  const newResourceCache =
    state.resourceCache.status === 'ready' ? { ...state.resourceCache.value, ...resourceCache } : resourceCache

  const newRouteMapping = { ...state.routeMapping }

  if (refresh) {
    entries<RouteStateType>(state.routeMapping)
      .filter(([_, route]) => route.routeType === EVENTS_ROUTE &&
        city === route.city &&
        path !== route.path &&
        language === route.language)
      .forEach(([key, route]) => {
        newRouteMapping[key] = route.path
          ? getEventRouteState(route.path, state, action)
          : getEventRouteState(null, state, action)
      })
  }

  return {
    ...state,
    routeMapping: {
      ...newRouteMapping,
      [key]: getEventRouteState(path, state, action)
    },
    resourceCache: {
      status: 'ready',
      progress: 1,
      value: newResourceCache
    }
  }
}

export default pushEvent
