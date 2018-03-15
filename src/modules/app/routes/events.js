// @flow

import { locationLayoutFetcher } from '../../endpoint/fetchers'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState } from 'redux-first-router/dist/flow-types'

export const EVENTS_ROUTE = 'EVENTS'

export const goToEvents = (city: string, language: string, eventId: ?number) =>
  createAction(EVENTS_ROUTE)({city, language, eventId})

export const eventsRoute = {
  path: '/:city/:language/events/:eventId?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    await locationLayoutFetcher(dispatch, getState)
  }
}
