// @flow

import Hashids from 'hashids'
import { WohnenOfferModel } from '@integreat-app/integreat-api-client'

export const SPRUNGBRETT_ROUTE = 'SprungbrettExtra'
export const SPRUNGBRETT_EXTRA = 'sprungbrett'

export const WOHNEN_ROUTE = 'WohnenExtra'
export const WOHNEN_EXTRA = 'wohnen'

export const hash = (offer: WohnenOfferModel) =>
  new Hashids().encode(offer.email.length, offer.createdDate.seconds())
