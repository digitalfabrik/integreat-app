// @flow

import type WohnenOfferModel from '../endpoint/models/WohnenOfferModel'
import Hashids from 'hashids'

export const SPRUNGBRETT_ROUTE = 'SprungbrettExtra'
export const SPRUNGBRETT_EXTRA = 'sprungbrett'

export const WOHNEN_ROUTE = 'WohnenExtra'
export const WOHNEN_EXTRA = 'wohnen'

export const hash = (offer: WohnenOfferModel) =>
  new Hashids().encode(offer.email.length, offer.createdDate.seconds())
