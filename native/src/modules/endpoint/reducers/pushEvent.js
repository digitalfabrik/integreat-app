// @flow

import type { CityContentStateType, EventRouteStateType } from '../../app/StateType'
import type { PushEventActionType } from '../../app/StoreActionType'
import { EventModel } from 'api-client'
import ErrorCodes from '../../error/ErrorCodes'
import { values, entries } from 'translations'

const getEventRouteState = (currentPath: ?string,
  state: CityContentStateType,
  action: PushEventActionType
): EventRouteStateType => {
  const { events, language, cityLanguages, city, refresh } = action.params

  // Check whether another page in the same city is loading, e.g. because it is being refreshed.
  // This is important for displaying the loading spinner.
  const otherEventPageLoading = values<EventRouteStateType>(state.eventsRouteMapping)
    .filter(route => city === route.city && currentPath !== route.path && language === route.language)
    .some(route => route.status === 'loading')

  const status: 'loading' | 'ready' = (otherEventPageLoading && !refresh) ? 'loading' : 'ready'
  if (!currentPath) {
    const allAvailableLanguages = new Map(cityLanguages.map(lng => [lng.code, null]))
    const eventRouteState = {
      path: null,
      language,
      city,
      models: events,
      allAvailableLanguages
    }
    if (status === 'loading') {
      return { status: 'loading', ...eventRouteState }
    } else {
      return { status: 'ready', ...eventRouteState }
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

  const eventRouteState = {
    path: currentPath,
    models: [event],
    allAvailableLanguages,
    language,
    city
  }

  if (status === 'loading') {
    return { status: 'loading', ...eventRouteState }
  } else {
    return { status: 'ready', ...eventRouteState }
  }
}

const pushEvent = (state: CityContentStateType, action: PushEventActionType): CityContentStateType => {
  const { path, key, language, resourceCache, city, refresh } = action.params

  // If there is an error in the old resourceCache, we want to override it
  const newResourceCache = state.resourceCache.status === 'ready'
    ? { ...state.resourceCache.value, ...resourceCache }
    : resourceCache

  const newEventsRouteMapping = { ...state.eventsRouteMapping }

  if (refresh) {
    entries<EventRouteStateType>(state.eventsRouteMapping)
      .filter(([_, route]) => city === route.city && path !== route.path && language === route.language)
      .forEach(([key, route]) => {
        newEventsRouteMapping[key] = route.path
          ? getEventRouteState(route.path, state, action)
          : getEventRouteState(null, state, action)
      })
  }

  return {
    ...state,
    eventsRouteMapping: {
      ...newEventsRouteMapping,
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
