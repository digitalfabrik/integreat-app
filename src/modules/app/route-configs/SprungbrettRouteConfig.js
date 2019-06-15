// @flow

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import {
  createCitiesEndpoint,
  createEventsEndpoint,
  createExtrasEndpoint,
  createLanguagesEndpoint,
  createSprungbrettJobsEndpoint,
  ExtraModel,
  Payload,
  SprungbrettModel
} from '@integreat-app/integreat-api-client'
import type { Route } from 'redux-first-router'
import fetchData from '../fetchData'
import { cmsApiBaseUrl } from '../constants/urls'

type SprungbrettRouteParamsType = {|city: string, language: string|}
type RequiredPayloadsType = {|sprungbrettJobs: Payload<Array<SprungbrettModel>>, extras: Payload<Array<ExtraModel>>|}

export const SPRUNGBRETT_ROUTE = 'SPRUNGBRETT'
export const SPRUNGBRETT_EXTRA = 'sprungbrett'

const fetchExtras = async (dispatch, getState) => {
  const state = getState()
  const {city, language} = state.location.payload
  const extrasPayload = await fetchData(createExtrasEndpoint(cmsApiBaseUrl), dispatch, state.extras, {
    city,
    language
  })
  const extras: ?Array<ExtraModel> = extrasPayload.data

  if (extras) {
    const sprungbrettExtra: ExtraModel | void = extras.find(extra => extra.alias === SPRUNGBRETT_EXTRA)
    if (sprungbrettExtra) {
      const params = {city, language}

      await fetchData(createSprungbrettJobsEndpoint(sprungbrettExtra.path), dispatch, state.sprungbrettJobs, params)
    }
  }
}

const sprungbrettRoute: Route = {
  path: `/:city/:language/extras/${SPRUNGBRETT_EXTRA}`,
  thunk: async (dispatch, getState) => {
    const state = getState()
    const {city, language} = state.location.payload

    await Promise.all([
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, {city, language}),
      fetchData(createLanguagesEndpoint(cmsApiBaseUrl), dispatch, state.languages, {city, language}),
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

  getLanguageChangePath = ({location, language}) =>
    this.getRoutePath({city: location.payload.city, language})

  getPageTitle = ({cityName, payloads}) => {
    if (!cityName) {
      return null
    }
    const extras = payloads.extras.data
    const sprungbrettExtra = extras && extras.find(extra => extra.alias === SPRUNGBRETT_EXTRA)
    return sprungbrettExtra ? `${sprungbrettExtra.title} - ${cityName}` : ''
  }

  getMetaDescription = () => null

  getFeedbackTargetInformation = ({payloads}) => {
    const extras = payloads.extras.data
    const extra = extras && extras.find(extra => extra.alias === SPRUNGBRETT_EXTRA)
    return ({alias: SPRUNGBRETT_EXTRA, title: extra && extra.title})
  }
}

export default SprungbrettRouteConfig
