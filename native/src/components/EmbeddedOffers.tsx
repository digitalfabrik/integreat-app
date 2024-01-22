import React, { ReactElement } from 'react'

import { MALTE_HELP_FORM_OFFER_ROUTE, OfferModel, SPRUNGBRETT_OFFER_ALIAS } from 'api-client'

import MalteHelpFormOffer from './MalteHelpFormOffer'
import SprungbrettOffer from './SprungbrettOffer'

type EmbeddedOfferProps = {
  embeddedOffers: OfferModel[]
  cityCode: string
  languageCode: string
  goBack: () => void
}

const EmbeddedOffers = ({
  embeddedOffers,
  cityCode,
  languageCode,
  goBack,
}: EmbeddedOfferProps): ReactElement | null => {
  const offer = embeddedOffers[0]
  switch (offer?.alias) {
    case SPRUNGBRETT_OFFER_ALIAS:
      return <SprungbrettOffer sprungbrettOffer={offer} languageCode={languageCode} />
    case MALTE_HELP_FORM_OFFER_ROUTE:
      return (
        <MalteHelpFormOffer
          malteHelpFormOffer={offer}
          cityCode={cityCode}
          languageCode={languageCode}
          onSubmit={goBack}
        />
      )
    default:
      return null
  }
}

export default EmbeddedOffers
