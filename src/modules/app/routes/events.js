// @flow

import { createAction } from 'redux-actions'

export const EVENTS_ROUTE = 'EVENTS'

export const goToEvents = (city: string, language: string, eventId: ?number) =>
  createAction(EVENTS_ROUTE)({city, language, eventId})

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/1234
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const eventsRoute = '/:city/:language/events/:eventId?'
