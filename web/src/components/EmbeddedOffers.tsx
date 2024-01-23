import React, { ReactElement } from 'react'

import { MALTE_HELP_FORM_OFFER_ROUTE, OfferModel, SPRUNGBRETT_OFFER_ALIAS } from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import MalteHelpFormOfferPage from '../routes/MalteHelpFormOfferPage'
import SprungbrettOfferPage from '../routes/SprungbrettOfferPage'

type EmbeddedOfferProps = {
  embeddedOffers: OfferModel[]
} & CityRouteProps

const EmbeddedOffers = ({ embeddedOffers, ...props }: EmbeddedOfferProps): ReactElement | null => {
  const offer = embeddedOffers[0]
  switch (offer?.alias) {
    case SPRUNGBRETT_OFFER_ALIAS:
      return <SprungbrettOfferPage {...props} embedded />
    case MALTE_HELP_FORM_OFFER_ROUTE:
      return <MalteHelpFormOfferPage {...props} embedded />
    default:
      return null
  }
}

export default EmbeddedOffers
