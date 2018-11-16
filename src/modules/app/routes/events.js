// @flow

import type { Route } from 'redux-first-router'

export const EVENTS_ROUTE = 'EVENTS'

export const getEventsPath = ({city, language}: {|city: string, language: string|}): string =>
  `/${city}/${language}/events`

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/begegnungscafe
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const eventsRoute: Route = '/:city/:language/events/:eventId?'

export default eventsRoute
