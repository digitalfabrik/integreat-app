// @flow

import { RouteConfig } from './RouteConfig'
import {
  ExtraModel,
  extrasEndpoint,
  Payload,
  SprungbrettModel,
  sprungbrettEndpoint
} from '@integreat-app/integreat-api-client'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './RouteConfig'

type SprungbrettRouteParamsType = {|city: string, language: string|}
type RequiredPayloadsType = {|sprungbrettJobs: Payload<Array<SprungbrettModel>>, extras: Payload<Array<ExtraModel>>|}

export const SPRUNGBRETT_ROUTE = 'SPRUNGBRETT'
export const SPRUNGBRETT_EXTRA = 'sprungbrett'

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

class SprungbrettRouteConfig implements RouteConfig<SprungbrettRouteParamsType, RequiredPayloadsType> {
  name = SPRUNGBRETT_ROUTE
  route = sprungbrettRoute

  getRoutePath = ({city, language}: SprungbrettRouteParamsType): string =>
    `/${city}/${language}/extras/${SPRUNGBRETT_EXTRA}`

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType =>
    ({sprungbrettJobs: payloads.sprungbrettJobsPayload, extras: payloads.extrasPayload})

  getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
    this.getRoutePath({city: location.payload.city, language})

  getPageTitle = ({cityName, payloads}: GetPageTitleParamsType<RequiredPayloadsType>) => {
    const extras = payloads.extras.data
    const sprungbrettExtra = extras && extras.find(extra => extra.alias === SPRUNGBRETT_EXTRA)
    return sprungbrettExtra ? `${sprungbrettExtra.title} - ${cityName}` : ''
  }
}

export default SprungbrettRouteConfig
