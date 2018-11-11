// @flow

import citiesEndpoint from '../../endpoint/endpoints/cities'
import { createAction } from 'redux-actions'

import type { Dispatch, GetState } from 'redux-first-router'
import CityModel from '../../endpoint/models/CityModel'
import I18nRedirectPage from '../../../routes/i18nRedirect/containers/I18nRedirectPage'
import React from 'react'
import Route from './Route'
import Payload from '../../endpoint/Payload'
import type { AllPayloadsType } from './types'

const I18N_REDIRECT_ROUTE = 'I18N_REDIRECT'

const goToI18nRedirect = (param: ?string) => createAction(I18N_REDIRECT_ROUTE)({param})

const renderI18nPage = ({cities}: {|cities: Payload<Array<CityModel>>|}) =>
  <I18nRedirectPage cities={cities} />

const getRequiredPayloads = (payloads: AllPayloadsType) => ({cities: payloads.citiesPayload})

/**
 * I18nRoute to redirect if no language is specified or to the not found route if the param is invalid.
 * Matches / and /param
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const i18nRedirectRoute = {
  path: '/:param?',
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()

    await citiesEndpoint.loadData(dispatch, state.cities)
  }
}

export default new Route({
  name: I18N_REDIRECT_ROUTE,
  goToRoute: goToI18nRedirect,
  renderPage: renderI18nPage,
  route: i18nRedirectRoute,
  getRequiredPayloads
})
