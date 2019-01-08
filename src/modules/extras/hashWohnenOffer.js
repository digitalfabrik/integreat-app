// @flow

import Hashids from 'hashids'
import { WohnenOfferModel } from '@integreat-app/integreat-api-client'

export const hashWohnenOffer = (offer: WohnenOfferModel) =>
  new Hashids().encode(offer.email.length, offer.createdDate.seconds())
