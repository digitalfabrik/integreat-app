// @flow

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import {
  createCitiesEndpoint,
  createEventsEndpoint,
  createOffersEndpoint,
  createLanguagesEndpoint,
  OfferModel,
  Payload
} from '@integreat-app/integreat-api-client'
import type { Route } from 'redux-first-router'
import fetchData from '../fetchData'
import { cmsApiBaseUrl } from '../constants/urls'

type OffersRouteParamsType = {|city: string, language: string|}
type RequiredPayloadsType = {|offers: Payload<Array<OfferModel>>|}

export const OFFERS_ROUTE = 'OFFERS'

/**
 * OffersRoute, matches /augsburg/de/offers and /augsburg/de/offers
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const offersRoute: Route = {
  path: '/:city/:language/offers/:offerId?',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const { city, language } = state.location.payload

    await Promise.all([
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, { city, language }),
      fetchData(createLanguagesEndpoint(cmsApiBaseUrl), dispatch, state.languages, { city, language }),
      fetchData(createOffersEndpoint(cmsApiBaseUrl), dispatch, state.offers, { city, language })
    ])
  }
}

class OffersRouteConfig implements RouteConfig<OffersRouteParamsType, RequiredPayloadsType> {
  name = OFFERS_ROUTE
  route = offersRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getRoutePath = ({ city, language }: OffersRouteParamsType): string => `/${city}/${language}/offers`

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({ offers: payloads.offersPayload })

  getLanguageChangePath = ({ location, language }) =>
    this.getRoutePath({ city: location.payload.city, language })

  getPageTitle = ({ t, cityName }) => cityName ? `${t('pageTitles.offers')} - ${cityName}` : null

  getMetaDescription = () => null

  getFeedbackTargetInformation = () => null
}

export default OffersRouteConfig
