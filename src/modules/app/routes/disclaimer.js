// @flow

import disclaimerEndpoint from '../../endpoint/endpoints/disclaimer'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState, Route } from 'redux-first-router'
import CityModel from '../../endpoint/models/CityModel'
import PageModel from '../../endpoint/models/PageModel'
import DisclaimerPage from '../../../routes/disclaimer/containers/DisclaimerPage'
import React from 'react'

export const DISCLAIMER_ROUTE = 'DISCLAIMER'

export const goToDisclaimer = (city: string, language: string) => createAction(DISCLAIMER_ROUTE)({city, language})

export const getDisclaimerPath = (city: string, language: string): string => `/${city}/${language}/disclaimer`

export const renderDisclaimerPage = (props: {|disclaimer: PageModel, cities: Array<CityModel>|}) =>
  <DisclaimerPage {...props} />

/**
 * DisclaimerRoute (for city specific disclaimers), matches /augsburg/de/disclaimer
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
export const disclaimerRoute: Route = {
  path: '/:city/:language/disclaimer',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await disclaimerEndpoint.loadData(dispatch, state.disclaimer, {city, language})
  }
}
