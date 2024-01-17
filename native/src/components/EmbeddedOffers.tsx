import React, { ReactElement } from 'react'

import { OfferModel, SPRUNGBRETT_ALIAS } from 'api-client'

import SprungbrettOffer from './SprungbrettOffer'

type EmbeddedOfferProps = {
  embeddedOffers: OfferModel[]
  languageCode: string
}

const EmbeddedOffers = ({ embeddedOffers, languageCode }: EmbeddedOfferProps): ReactElement | null => {
  const offer = embeddedOffers[0]
  if (offer?.alias === SPRUNGBRETT_ALIAS) {
    return <SprungbrettOffer sprungbrettOffer={offer} languageCode={languageCode} />
  }
  return null
}

export default EmbeddedOffers
