// @flow

import { RouteConfig } from './RouteConfig'
import {
  ExtraModel,
  extrasEndpoint,
  Payload,
  SprungbrettModel,
  sprungbrettEndpoint, citiesEndpoint, eventsEndpoint, languagesEndpoint
} from '@integreat-app/integreat-api-client'
import type { Route } from 'redux-first-router'
import fetchData from '../fetchData'
import type {
  AllPayloadsType,
  GetFeedbackReferenceType,
  GetLanguageChangePathParamsType,
  GetPageTitleParamsType
} from './RouteConfig'

type SprungbrettRouteParamsType = {|city: string, language: string|}
type RequiredPayloadsType = {|sprungbrettJobs: Payload<Array<SprungbrettModel>>, extras: Payload<Array<ExtraModel>>|}

export const SPRUNGBRETT_ROUTE = 'SPRUNGBRETT'
export const SPRUNGBRETT_EXTRA = 'sprungbrett'

const fetchExtras = async (dispatch, getState) => {
  const state = getState()
  const {city, language} = state.location.payload
  const extrasPayload = await fetchData(extrasEndpoint, dispatch, state.extras, {city, language})
  const extras: ?Array<ExtraModel> = extrasPayload.data

  if (extras) {
    const sprungbrettExtra: ExtraModel | void = extras.find(extra => extra.alias === SPRUNGBRETT_EXTRA)
    if (sprungbrettExtra) {
      const params = {city, language, url: sprungbrettExtra.path}

      await fetchData(sprungbrettEndpoint, dispatch, state.sprungbrettJobs, params)
    }
  }
}

const sprungbrettRoute: Route = {
  path: `/:city/:language/extras/${SPRUNGBRETT_EXTRA}`,
  thunk: async (dispatch, getState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await Promise.all([
      fetchData(citiesEndpoint, dispatch, state.cities),
      fetchData(eventsEndpoint, dispatch, state.events, {city, language}),
      fetchData(languagesEndpoint, dispatch, state.languages, {city, language}),
      fetchExtras(dispatch, getState)
    ])
  }
}

class SprungbrettRouteConfig implements RouteConfig<SprungbrettRouteParamsType, RequiredPayloadsType> {
  name = SPRUNGBRETT_ROUTE
  route = sprungbrettRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getRoutePath = ({city, language}: SprungbrettRouteParamsType): string =>
    `/${city}/${language}/extras/${SPRUNGBRETT_EXTRA}`

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType =>
    ({sprungbrettJobs: payloads.sprungbrettJobsPayload, extras: payloads.extrasPayload})

  getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType<RequiredPayloadsType>) =>
    this.getRoutePath({city: location.payload.city, language})

  getPageTitle = ({cityName, payloads}: GetPageTitleParamsType<RequiredPayloadsType>) => {
    const extras = payloads.extras.data
    const sprungbrettExtra = extras && extras.find(extra => extra.alias === SPRUNGBRETT_EXTRA)
    return sprungbrettExtra ? `${sprungbrettExtra.title} - ${cityName}` : ''
  }

  getMetaDescription = () => null

  getFeedbackReference = ({payloads}: GetFeedbackReferenceType<RequiredPayloadsType>) => {
    const extras = payloads.extras.data
    const extra = extras && extras.find(extra => extra.alias === SPRUNGBRETT_EXTRA)
    return ({alias: SPRUNGBRETT_EXTRA, title: extra && extra.title})
  }
}

export default SprungbrettRouteConfig
