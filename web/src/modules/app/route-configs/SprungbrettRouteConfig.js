// @flow

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import {
  createCitiesEndpoint,
  createEventsEndpoint,
  createOffersEndpoint,
  createLanguagesEndpoint,
  createSprungbrettJobsEndpoint,
  SPRUNGBRETT_OFFER,
  OfferModel,
  Payload,
  SprungbrettJobModel
} from 'api-client'
import type { Route } from 'redux-first-router'
import fetchData from '../fetchData'
import { cmsApiBaseUrl } from '../constants/urls'
import type { StateType } from '../StateType'

type SprungbrettRouteParamsType = {|city: string, language: string|}
type RequiredPayloadsType = {|sprungbrettJobs: Payload<Array<SprungbrettJobModel>>, offers: Payload<Array<OfferModel>>|}

export const SPRUNGBRETT_ROUTE = 'SPRUNGBRETT'

const fetchOffers = async (dispatch, getState) => {
  const state: StateType = getState()
  const { city, language } = state.location.payload
  const offersPayload = await fetchData(createOffersEndpoint(cmsApiBaseUrl), dispatch, state.offers, {
    city,
    language
  })
  const offers: ?Array<OfferModel> = offersPayload.data

  if (offers) {
    const sprungbrettOffer: OfferModel | void = offers.find(offer => offer.alias === SPRUNGBRETT_OFFER)
    if (sprungbrettOffer) {
      const params = { city, language }

      await fetchData(createSprungbrettJobsEndpoint(sprungbrettOffer.path), dispatch, state.sprungbrettJobs, params)
    }
  }
}

const sprungbrettRoute: Route = {
  path: `/:city/:language/offers/${SPRUNGBRETT_OFFER}`,
  thunk: async (dispatch, getState) => {
    const state: StateType = getState()
    const { city, language } = state.location.payload

    await Promise.all([
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, { city, language }),
      fetchData(createLanguagesEndpoint(cmsApiBaseUrl), dispatch, state.languages, { city, language }),
      fetchOffers(dispatch, getState)
    ])
  }
}

class SprungbrettRouteConfig implements RouteConfig<SprungbrettRouteParamsType, RequiredPayloadsType> {
  name = SPRUNGBRETT_ROUTE
  route = sprungbrettRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getRoutePath = ({ city, language }: SprungbrettRouteParamsType): string =>
    `/${city}/${language}/offers/${SPRUNGBRETT_OFFER}`

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType =>
    ({ sprungbrettJobs: payloads.sprungbrettJobsPayload, offers: payloads.offersPayload })

  getLanguageChangePath = ({ location, language }) =>
    this.getRoutePath({ city: location.payload.city, language })

  getPageTitle = ({ cityName, payloads }) => {
    if (!cityName) {
      return null
    }
    const offers = payloads.offers.data
    const sprungbrettOffer = offers && offers.find(offer => offer.alias === SPRUNGBRETT_OFFER)
    return sprungbrettOffer ? `${sprungbrettOffer.title} - ${cityName}` : ''
  }

  getMetaDescription = () => null

  getFeedbackTargetInformation = ({ payloads }) => {
    const offers = payloads.offers.data
    const offer = offers && offers.find(offer => offer.alias === SPRUNGBRETT_OFFER)
    if (offer) {
      return ({ alias: SPRUNGBRETT_OFFER, title: offer.title })
    }
    return null
  }
}

export default SprungbrettRouteConfig
