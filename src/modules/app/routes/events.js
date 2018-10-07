// @flow

import { createAction } from 'redux-actions'

export const EVENTS_ROUTE = 'EVENTS'

export const goToEvents = (city: string, language: string, eventId: ?string) =>
  createAction(EVENTS_ROUTE)({city, language, eventId})

export const getEventsPath = (city: string, language: string): string => `/${city}/${language}/events`

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/begegnungscafe
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const eventsRoute = '/:city/:language/events/:eventId?'
