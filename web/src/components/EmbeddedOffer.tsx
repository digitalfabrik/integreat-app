import React, { ReactElement } from 'react'

import { OfferModel, SPRUNGBRETT_OFFER } from 'api-client'

import { CityRouteProps } from '../CityContentSwitcher'
import SprungbrettOfferPage from '../routes/SprungbrettOfferPage'

type EmbeddedOfferProps = {
  offer: OfferModel
} & CityRouteProps

const EmbeddedOffer = ({ offer, ...props }: EmbeddedOfferProps): ReactElement | null => {
  if (offer.alias === SPRUNGBRETT_OFFER) {
    return <SprungbrettOfferPage {...props} embedded />
  }
  return null
}

export default EmbeddedOffer
