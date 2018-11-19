// @flow

import React from 'react'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './types'
import RouteConfig from './RouteConfig'
import SprungbrettExtraPage from '../../../routes/sprungbrett/containers/SprungbrettExtraPage'
import Payload from '../../endpoint/Payload'
import SprungbrettModel from '../../endpoint/models/SprungbrettJobModel'
import ExtraModel from '../../endpoint/models/ExtraModel'
import extrasEndpoint from '../../endpoint/endpoints/extras'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'
import sprungbrettEndpoint from '../../endpoint/endpoints/sprungbrettJobs'

type RequiredPayloadType = {|extras: Payload<Array<ExtraModel>>, sprungbrettJobs: Payload<Array<SprungbrettModel>>|}
type SprungbrettRouteParamsType = {|city: string, language: string|}

export const SPRUNGBRETT_ROUTE = 'SPRUNGBRETT'
export const SPRUNGBRETT_EXTRA = 'sprungbrett'

const getSprungbrettPath = ({city, language}: SprungbrettRouteParamsType): string =>
  `/${city}/${language}/extras/${SPRUNGBRETT_EXTRA}`

const sprungbrettRoute: Route = {
  path: `/:city/:language/extras/${SPRUNGBRETT_EXTRA}`,
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    const extrasPayload = await fetchData(extrasEndpoint, dispatch, state.extras, { city, language })
    const extras: ?Array<ExtraModel> = extrasPayload.data

    if (extras) {
      const sprungbrettExtra: ExtraModel | void = extras.find(extra => extra.alias === SPRUNGBRETT_EXTRA)
      if (sprungbrettExtra) {
        const params = {city, language, url: sprungbrettExtra.path}
        const sprungbrettEndpoint1 = sprungbrettEndpoint

        await fetchData(sprungbrettEndpoint1, dispatch, state.sprungbrettJobs, params)
      }
    }
  }
}
const renderSprungbrettPage = ({ sprungbrettJobs, extras }: RequiredPayloadType) =>
  <SprungbrettExtraPage sprungbrettJobs={sprungbrettJobs.data} extras={extras.data} />

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadType =>
  ({sprungbrettJobs: payloads.sprungbrettJobsPayload, extras: payloads.extrasPayload})

const getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
  getSprungbrettPath({city: location.payload.city, language})

const getPageTitle = ({t, cityName}: GetPageTitleParamsType) =>
  `${t('pageTitles.sprungbrett')} - ${cityName}`

class SprungbrettRouteConfig extends RouteConfig<RequiredPayloadType, SprungbrettRouteParamsType> {
  constructor () {
    super({
      name: SPRUNGBRETT_ROUTE,
      route: sprungbrettRoute,
      getRoutePath: getSprungbrettPath,
      getRequiredPayloads,
      getLanguageChangePath,
      getPageTitle
    })
  }
}

export default SprungbrettRouteConfig
