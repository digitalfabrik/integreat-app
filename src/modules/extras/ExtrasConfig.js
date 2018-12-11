// @flow

import type WohnenOfferModel from '../endpoint/models/WohnenOfferModel'
import Hashids from 'hashids'

type WohnenRouteParamsType = {| city: string, language: string, offerHash?: string |}
type SprungbrettRouteParamsType = {| city: string, language: string |}

export const SPRUNGBRETT_ROUTE = 'SPRUNGBRETT'
export const SPRUNGBRETT_EXTRA = 'sprungbrett'

export const WOHNEN_ROUTE = 'WOHNEN'
export const WOHNEN_EXTRA = 'wohnen'

export const getWohnenRoutePath = ({city, language, offerHash}: WohnenRouteParamsType): string =>
  `/${city}/${language}/extras/${WOHNEN_EXTRA}${offerHash ? `/${offerHash}` : ''}`

export const getSprungbrettRoutePath = ({city, language}: SprungbrettRouteParamsType): string =>
  `/${city}/${language}/extras/${SPRUNGBRETT_EXTRA}`

export const hash = (offer: WohnenOfferModel) =>
  new Hashids().encode(offer.email.length, offer.createdDate.seconds())
