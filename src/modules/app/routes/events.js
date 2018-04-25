// @flow

import { createAction } from 'redux-actions'
import type { Action } from 'redux-first-router/dist/flow-types'

export const EVENTS_ROUTE = 'EVENTS'

export const goToEvents = (city: string, language: string, eventId: ?number): Action =>
  createAction(EVENTS_ROUTE)({city, language, eventId})

export const getEventPath = (city: string, language: string, eventId: ?number): string =>
  `/${city}/${language}/events${eventId ? `/${eventId}` : ''}`

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/1234
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const eventsRoute = '/:city/:language/events/:eventId?'
