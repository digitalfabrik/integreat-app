import Hashids from 'hashids'
import { WohnenOfferModel } from 'api-client'
export const hashWohnenOffer = (offer: WohnenOfferModel) =>
  new Hashids().encode(offer.email.length, offer.createdDate.seconds())
