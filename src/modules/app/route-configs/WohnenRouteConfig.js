// @flow

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import type { Route } from 'redux-first-router'
import fetchData from '../fetchData'
import Hashids from 'hashids'
import {
  createCitiesEndpoint,
  createEventsEndpoint,
  createOffersEndpoint,
  createLanguagesEndpoint,
  createWohnenEndpoint,
  OfferModel,
  Payload,
  WohnenOfferModel
} from '@integreat-app/integreat-api-client'
import { cmsApiBaseUrl, wohnenApiBaseUrl } from '../constants/urls'

type RouteParamsType = {|city: string, language: string, offerHash?: string|}
type RequiredPayloadsType = {|offers: Payload<Array<WohnenOfferModel>>, offers: Payload<Array<OfferModel>>|}

export const WOHNEN_ROUTE = 'WOHNEN'
export const WOHNEN_EXTRA = 'wohnen'

export const hash = (offer: WohnenOfferModel) =>
  new Hashids().encode(offer.email.length, offer.createdDate.seconds())

const fetchOffers = async (dispatch, getState) => {
  const state = getState()
  const { city, language } = state.location.payload
  const offersPayload = await fetchData(createOffersEndpoint(cmsApiBaseUrl), dispatch, state.offers, {
    city,
    language
  })
  const offers: ?Array<OfferModel> = offersPayload.data

  if (offers) {
    const wohnenOffer: OfferModel | void = offers.find(offer => offer.alias === WOHNEN_EXTRA)
    if (wohnenOffer && wohnenOffer.postData) {
      const params = { city: wohnenOffer.postData.get('api-name') }
      await fetchData(createWohnenEndpoint(wohnenApiBaseUrl), dispatch, state.wohnen, params)
    }
  }
}

const wohnenRoute: Route = {
  path: `/:city/:language/offers/${WOHNEN_EXTRA}/:offerHash?`,
  thunk: async (dispatch, getState) => {
    const state = getState()
    const { city, language } = state.location.payload

    await Promise.all([
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, { city, language }),
      fetchData(createLanguagesEndpoint(cmsApiBaseUrl), dispatch, state.languages, { city, language }),
      fetchOffers(dispatch, getState)
    ])
  }
}

class WohnenRouteConfig implements RouteConfig<RouteParamsType, RequiredPayloadsType> {
  name = WOHNEN_ROUTE
  route = wohnenRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getRoutePath = ({ city, language, offerHash }: RouteParamsType): string =>
    `/${city}/${language}/offers/${WOHNEN_EXTRA}${offerHash ? `/${offerHash}` : ''}`

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType =>
    ({ offers: payloads.wohnenPayload, extras: payloads.offersPayload })

  getLanguageChangePath = ({ location, language }) =>
    this.getRoutePath({ city: location.payload.city, language })

  getPageTitle = ({ cityName, payloads, location }) => {
    if (!cityName) {
      return null
    }
    const offerHash = location.payload.offerHash
    const offers = { ...payloads.offers.data, ...payloads.extras.data }
    const offerModel = offers && offers.find(offer => hash(offer) === offerHash)
    if (offerModel) {
      return `${offerModel.formData.accommodation.title} - ${cityName}`
    }
    const wohnenOffer = offers && offers.find(offer => offer.alias === WOHNEN_EXTRA)
    return wohnenOffer ? `${wohnenOffer.title} - ${cityName}` : ''
  }

  getMetaDescription = () => null

  getFeedbackTargetInformation = ({ payloads }) => {
    const offers = payloads.offers.data
    const offer = offers && offers.find(offer => offer.alias === WOHNEN_EXTRA)
    return ({ alias: WOHNEN_EXTRA, title: offer && offer.title })
  }
}

export default WohnenRouteConfig
