import React, { ReactElement } from 'react'

import { MALTE_HELP_FORM_ALIAS, OfferModel, SPRUNGBRETT_ALIAS } from 'api-client'

import MalteHelpForm from './MalteHelpForm'
import SprungbrettOffer from './SprungbrettOffer'

type EmbeddedOfferProps = {
  offer: OfferModel
  cityCode: string
  languageCode: string
}

const EmbeddedOffer = ({ offer, cityCode, languageCode }: EmbeddedOfferProps): ReactElement | null => {
  if (offer.alias === SPRUNGBRETT_ALIAS) {
    return <SprungbrettOffer sprungbrettOffer={offer} cityCode={cityCode} languageCode={languageCode} />
  }
  if (offer.alias === MALTE_HELP_FORM_ALIAS) {
    return <MalteHelpForm malteHelpFormOffer={offer} cityCode={cityCode} languageCode={languageCode} />
  }
  return null
}

export default EmbeddedOffer
