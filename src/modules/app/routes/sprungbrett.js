// @flow

import extrasEndpoint from '../../endpoint/endpoints/extras'
import sprungbrettEndpoint from '../../endpoint/endpoints/sprungbrettJobs'
import type { Dispatch, GetState, Route as RouterRouteType } from 'redux-first-router'
import ExtraModel from '../../endpoint/models/ExtraModel'
import SprungbrettModel from '../../endpoint/models/SprungbrettJobModel'
import SprungbrettExtraPage from '../../../routes/sprungbrett/containers/SprungbrettExtraPage'
import React from 'react'
import Payload from '../../endpoint/Payload'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './types'
import Route from './Route'
import fetchData from '../fetchData'

type RequiredPayloadType = {|extras: Payload<Array<ExtraModel>>, sprungbrettJobs: Payload<Array<SprungbrettModel>>|}
type RouteParamsType = {|city: string, language: string|}

export const SPRUNGBRETT_ROUTE = 'SPRUNGBRETT'
export const SPRUNGBRETT_EXTRA = 'sprungbrett'

const getRoutePath = ({city, language}: RouteParamsType): string =>
  `/${city}/${language}/extras/${SPRUNGBRETT_EXTRA}`

const renderSprungbrettPage = ({ sprungbrettJobs, extras }: RequiredPayloadType) =>
  <SprungbrettExtraPage sprungbrettJobs={sprungbrettJobs.data} extras={extras.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({sprungbrettJobs: payloads.sprungbrettJobsPayload, extras: payloads.extrasPayload})

const getLanguageChangePath = ({location}: GetLanguageChangePathParamsType) =>
  getRoutePath({city: location.payload.city, language: location.payload.language})

const getPageTitle = ({t, cityName}: GetPageTitleParamsType) =>
  `${t('pageTitle')} - ${cityName}`

const route: RouterRouteType = {
  path: `/:city/:language/extras/${SPRUNGBRETT_EXTRA}`,
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const { city, language } = state.location.payload

    const extrasPayload = await fetchData(extrasEndpoint, dispatch, state.extras, { city, language })
    const extras: ?Array<ExtraModel> = extrasPayload.data

    if (extras) {
      const sprungbrettExtra: ExtraModel | void = extras.find(extra => extra.alias === SPRUNGBRETT_EXTRA)
      if (sprungbrettExtra) {
        const params = { city, language, url: sprungbrettExtra.path }
        const sprungbrettEndpoint1 = sprungbrettEndpoint

        await fetchData(sprungbrettEndpoint1, dispatch, state.sprungbrettJobs, params)
      }
    }
  }
}

const sprungbrettRoute: Route<RequiredPayloadType, RouteParamsType> = new Route({
  name: SPRUNGBRETT_ROUTE,
  getRoutePath,
  renderPage: renderSprungbrettPage,
  route,
  getRequiredPayloads,
  getLanguageChangePath,
  getPageTitle
})

export default sprungbrettRoute
