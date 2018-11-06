// @flow

import { createAction } from 'redux-actions'
import type { Route } from 'redux-first-router'

export const EVENTS_ROUTE = 'EVENTS'

export const goToEvents = (city: string, language: string) =>
  createAction<string, { city: string, language: string }>(EVENTS_ROUTE)({
    city,
    language
  })

export const getEventsPath = (city: string, language: string): string => `/${city}/${language}/events`

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/begegnungscafe
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const eventsRoute: Route = '/:city/:language/events/:eventId?'
