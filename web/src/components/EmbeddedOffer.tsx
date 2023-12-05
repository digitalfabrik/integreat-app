import React, { ReactElement } from 'react'

import { MALTE_HELP_FORM_OFFER_ROUTE, OfferModel, SPRUNGBRETT_OFFER } from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import SprungbrettOfferPage from '../routes/SprungbrettOfferPage'
import MalteHelpFormOfferPage from '../routes/MalteHelpFormOfferPage'

type EmbeddedOfferProps = {
  offer: OfferModel
} & CityRouteProps

const EmbeddedOffer = ({ offer, ...props }: EmbeddedOfferProps): ReactElement | null => {
  if (offer.alias === SPRUNGBRETT_OFFER) {
    return <SprungbrettOfferPage {...props} embedded />
  }
  if (offer.alias === MALTE_HELP_FORM_OFFER_ROUTE) {
    return <MalteHelpFormOfferPage {...props} embedded />
  }
  return null
}

export default EmbeddedOffer
