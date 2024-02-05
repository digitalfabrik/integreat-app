import React, { ReactElement } from 'react'

import { MALTE_HELP_FORM_OFFER_ROUTE, SPRUNGBRETT_OFFER_ALIAS } from 'shared'
import { CategoryModel } from 'shared/api'

import { CityRouteProps } from '../CityContentSwitcher'
import MalteHelpFormOfferPage from '../routes/MalteHelpFormOfferPage'
import SprungbrettOfferPage from '../routes/SprungbrettOfferPage'

type EmbeddedOfferProps = {
  category: CategoryModel
} & CityRouteProps

const EmbeddedOffers = ({ category, ...props }: EmbeddedOfferProps): ReactElement | null => {
  const offer = category.embeddedOffers[0]
  switch (offer?.alias) {
    case SPRUNGBRETT_OFFER_ALIAS:
      return <SprungbrettOfferPage {...props} embedded />
    case MALTE_HELP_FORM_OFFER_ROUTE:
      return <MalteHelpFormOfferPage {...props} categoryPageTitle={category.title} embedded />
    default:
      return null
  }
}

export default EmbeddedOffers
