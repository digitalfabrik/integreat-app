// @flow

import type { Bag, Dispatch, GetState } from 'redux-first-router/dist/flow-types'
import { citiesEndpoint, languagesEndpoint, eventsEndpoint } from '@integreat-app/integreat-api-client'

import fetchData from './fetchData'
import { getRouteConfig } from './route-configs'

/**
 * This handles the loading of additional data for the location layout
 * (onBeforeChange is executed before a change of the route)
 */
const onBeforeChange = (dispatch: Dispatch, getState: GetState, bag: Bag): void => {
  const state = getState()
  const {city, language} = bag.action.payload
  const route = bag.action.type
  const params = {city, language}

  // in the following routes we have a location layout, so we need cities, languages and events
  if (getRouteConfig(route).isLocationLayoutRoute) {
    fetchData(citiesEndpoint, dispatch, state.cities)
    fetchData(eventsEndpoint, dispatch, state.events, params)
    fetchData(languagesEndpoint, dispatch, state.languages, params)
  }
}

export default onBeforeChange
