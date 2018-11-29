// @flow

import type { Bag, Dispatch, GetState } from 'redux-first-router/dist/flow-types'
import { Payload, citiesEndpoint, languagesEndpoint, eventsEndpoint } from '@integreat-app/integreat-api-client'

import fetchData from './fetchData'
import { getRouteConfig } from './route-configs'

/**
 * This handles the loading of additional data for the location layout
 * (onBeforeChange is executed before a change of the route)
 */
const onBeforeChange = async (dispatch: Dispatch, getState: GetState, bag: Bag): Promise<Payload<*>> => {
  const state = getState()
  const {city, language} = bag.action.payload
  const route = bag.action.type
  const params = {city, language}

  // in the following routes we have a location layout, so we need cities, languages and events
  if (getRouteConfig(route).isLocationLayoutRoute) {
    await Promise.all([
      fetchData(citiesEndpoint, dispatch, state.cities),
      fetchData(eventsEndpoint, dispatch, state.events, params),
      fetchData(languagesEndpoint, dispatch, state.languages, params)])
  }

  return Promise.resolve(new Payload(false))
}

export default onBeforeChange
