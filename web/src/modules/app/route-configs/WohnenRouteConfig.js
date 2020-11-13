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
  WOHNEN_OFFER,
  OfferModel,
  Payload,
  WohnenOfferModel
} from 'api-client'
import { cmsApiBaseUrl, wohnenApiBaseUrl } from '../constants/urls'
import type { StateType } from '../StateType'

type RouteParamsType = {| city: string, language: string, offerHash?: string |}
type RequiredPayloadsType = {| wohnenOffers: Payload<Array<WohnenOfferModel>>, offers: Payload<Array<OfferModel>> |}

export const WOHNEN_ROUTE = 'WOHNEN'

export const hash = (offer: WohnenOfferModel) =>
  new Hashids().encode(offer.email.length, offer.createdDate.seconds())

const fetchOffers = async (dispatch, getState) => {
  const state: StateType = getState()
  const { city, language } = state.location.payload
  const offersPayload = await fetchData(createOffersEndpoint(cmsApiBaseUrl), dispatch, state.offers, {
    city,
    language
  })
  const offers: ?Array<OfferModel> = offersPayload.data

  if (offers) {
    const offer: OfferModel | void = offers.find(offer => offer.alias === WOHNEN_OFFER)
    if (offer && offer.postData) {
      const params = { city: offer.postData.get('api-name') }
      await fetchData(createWohnenEndpoint(wohnenApiBaseUrl), dispatch, state.wohnen, params)
    }
  }
}

const wohnenRoute: Route = {
  path: `/:city/:language/offers/${WOHNEN_OFFER}/:offerHash?`,
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

class WohnenRouteConfig implements RouteConfig<RouteParamsType, RequiredPayloadsType> {
  name = WOHNEN_ROUTE
  route = wohnenRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getRoutePath = ({ city, language, offerHash }: RouteParamsType): string =>
    `/${city}/${language}/offers/${WOHNEN_OFFER}${offerHash ? `/${offerHash}` : ''}`

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType =>
    ({ wohnenOffers: payloads.wohnenOffersPayload, offers: payloads.offersPayload })

  getLanguageChangePath = ({ location, language }) =>
    this.getRoutePath({ city: location.payload.city, language })

  getPageTitle = ({ cityName, payloads, location }) => {
    if (!cityName) {
      return null
    }
    const wohnenOfferHash = location.payload.offerHash
    const wohnenOffers = payloads.wohnenOffers.data
    const offers = payloads.offers.data
    const wohnenOfferModel = wohnenOffers && wohnenOffers.find(wohnenOffer => hash(wohnenOffer) === wohnenOfferHash)
    if (wohnenOfferModel) {
      return `${wohnenOfferModel.formData.accommodation.title} - ${cityName}`
    }
    const offer = offers && offers.find(offer => offer.alias === WOHNEN_OFFER)
    return offer ? `${offer.title} - ${cityName}` : ''
  }

  getMetaDescription = () => null

  getFeedbackTargetInformation = ({ payloads }) => {
    const offers = payloads.offers.data
    const offer = offers && offers.find(offer => offer.alias === WOHNEN_OFFER)
    if (!offer) {
      return null
    }
    return ({ alias: WOHNEN_OFFER, title: offer.title })
  }
}

export default WohnenRouteConfig
