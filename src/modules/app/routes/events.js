// @flow

import { locationLayoutFetcher } from '../../endpoint/fetchers'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState } from 'redux-first-router/dist/flow-types'
import { clearStoreOnCityChange, clearStoreOnLanguageChange } from '../../endpoint/actions/remover'

export const EVENTS_ROUTE = 'EVENTS'

export const goToEvents = (city: string, language: string, eventId: ?number) =>
  createAction(EVENTS_ROUTE)({city, language, eventId})

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/1234
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const eventsRoute = {
  path: '/:city/:language/events/:eventId?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const {city, language} = getState().location.payload
    const prev = getState().location.prev

    if (prev.payload.language && prev.payload.language !== language) {
      clearStoreOnLanguageChange(dispatch, getState)
    }

    if (prev.payload.city && prev.payload.city !== city) {
      clearStoreOnCityChange(dispatch, getState)
    }

    await locationLayoutFetcher(dispatch, getState)
  }
}
