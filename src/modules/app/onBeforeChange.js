// @flow

import type { Dispatch, GetState, Bag } from 'redux-first-router/dist/flow-types'
import { CATEGORIES_ROUTE } from './routes/categories'
import citiesEndpoint from '../endpoint/endpoints/cities'
import languagesEndpoint from '../endpoint/endpoints/languages'
import eventsEndpoint from '../endpoint/endpoints/events'

import { EVENTS_ROUTE } from './routes/events'
import { EXTRAS_ROUTE } from './routes/extras'
import { DISCLAIMER_ROUTE } from './routes/disclaimer'
import { SEARCH_ROUTE } from './routes/search'

/**
 * This handles the loading of additional data for the location layout
 * (onBeforeChange is executed before a change of the route)
 */
const onBeforeChange = async (dispatch: Dispatch, getState: GetState, bag: Bag) => {
  const state = getState()
  const {city, language} = bag.action.payload
  const route = bag.action.type
  const params = {city, language}

  // in the following routes we have a location layout, so we need cities, languages and events
  if ([CATEGORIES_ROUTE, EVENTS_ROUTE, EXTRAS_ROUTE, DISCLAIMER_ROUTE, SEARCH_ROUTE].includes(route)) {
    await citiesEndpoint.loadData(dispatch, state.cities, params)

    await languagesEndpoint.loadData(dispatch, state.languages, params)

    await eventsEndpoint.loadData(dispatch, state.events, params)
  }
}

export default onBeforeChange
