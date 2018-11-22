// @flow

import ExtraModel from '../../endpoint/models/ExtraModel'
import RouteConfig from './RouteConfig'
import extrasEndpoint from '../../endpoint/endpoints/extras'
import type { Dispatch, GetState, Route } from 'redux-first-router'
import fetchData from '../fetchData'
import wohnenEndpoint from '../../endpoint/endpoints/wohnen'
import type { AllPayloadsType, GetLanguageChangePathParamsType, GetPageTitleParamsType } from './RouteConfig'
import Payload from '../../endpoint/Payload'
import WohnenOfferModel from '../../endpoint/models/WohnenOfferModel'
import Hashids from 'hashids'

type RouteParamsType = {|city: string, language: string, offerHash?: string|}
type RequiredPayloadsType = {|offers: Payload<Array<WohnenOfferModel>>, extras: Payload<Array<ExtraModel>>|}

export const WOHNEN_ROUTE = 'WOHNEN'
export const WOHNEN_EXTRA = 'wohnen'

export const hash = (offer: WohnenOfferModel) =>
  new Hashids().encode(offer.email.length, offer.createdDate.seconds())

const getWohnenPath = ({city, language, offerHash}: RouteParamsType): string =>
  `/${city}/${language}/extras/${WOHNEN_EXTRA}${offerHash ? `/${offerHash}` : ''}`

const wohnenRoute: Route = {
  path: `/:city/:language/extras/${WOHNEN_EXTRA}/:offerHash?`,
  thunk: async (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const {city, language} = state.location.payload

    const extrasPayload = await fetchData(extrasEndpoint, dispatch, state.extras, {city, language})
    const extras: ?Array<ExtraModel> = extrasPayload.data

    if (extras) {
      const wohnenExtra: ExtraModel | void = extras.find(extra => extra.alias === WOHNEN_EXTRA)
      if (wohnenExtra && wohnenExtra.postData) {
        const params = {city: wohnenExtra.postData.get('api-name')}
        await fetchData(wohnenEndpoint, dispatch, state.wohnen, params)
      }
    }
  }
}

const getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType =>
  ({offers: payloads.wohnenPayload, extras: payloads.extrasPayload})

const getLanguageChangePath = ({location, language}: GetLanguageChangePathParamsType) =>
  getWohnenPath({city: location.payload.city, language})

const getPageTitle = ({cityName, extras, offers, offerHash}: GetPageTitleParamsType) => {
  const offerModel = offers && offers.find(offer => hash(offer) === offerHash)
  if (offerModel) {
    return `${offerModel.formData.accommodation.title} - ${cityName}`
  }
  const wohnenExtra = extras && extras.find(extra => extra.alias === WOHNEN_EXTRA)
  return wohnenExtra ? `${wohnenExtra.title} - ${cityName}` : ''
}

class WohnenRouteConfig extends RouteConfig<RouteParamsType, RequiredPayloadsType> {
  constructor () {
    super({
      name: WOHNEN_ROUTE,
      route: wohnenRoute,
      getRoutePath: getWohnenPath,
      getLanguageChangePath,
      getPageTitle,
      getRequiredPayloads
    })
  }
}

export default WohnenRouteConfig
