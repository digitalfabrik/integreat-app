// @flow

import type { Bag, Dispatch, GetState } from 'redux-first-router'
import citiesEndpoint from '../endpoint/endpoints/cities'
import languagesEndpoint from '../endpoint/endpoints/languages'
import eventsEndpoint from '../endpoint/endpoints/events'

import { LocationLayoutRoutes } from '../layout/containers/LocationLayout'

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
  if (LocationLayoutRoutes.includes(route)) {
    await Promise.all([citiesEndpoint.loadData(dispatch, state.cities),
      languagesEndpoint.loadData(dispatch, state.languages, params),
      eventsEndpoint.loadData(dispatch, state.events, params)])
  }
}

export default onBeforeChange
