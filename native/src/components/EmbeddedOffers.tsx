import React, { ReactElement } from 'react'

import { CATEGORIES_ROUTE, MALTE_HELP_FORM_OFFER_ROUTE, SPRUNGBRETT_OFFER_ALIAS } from 'shared'
import { CategoryModel } from 'shared/api'

import urlFromRouteInformation from '../navigation/url'
import MalteHelpFormOffer from './MalteHelpFormOffer'
import SprungbrettOffer from './SprungbrettOffer'

type EmbeddedOfferProps = {
  category: CategoryModel
  cityCode: string
  languageCode: string
  goBack: () => void
}

const EmbeddedOffers = ({ category, cityCode, languageCode, goBack }: EmbeddedOfferProps): ReactElement | null => {
  const offer = category.embeddedOffers[0]
  switch (offer?.alias) {
    case SPRUNGBRETT_OFFER_ALIAS:
      return <SprungbrettOffer sprungbrettOffer={offer} languageCode={languageCode} />
    case MALTE_HELP_FORM_OFFER_ROUTE: {
      const url = urlFromRouteInformation({
        route: CATEGORIES_ROUTE,
        languageCode,
        cityCode,
        cityContentPath: category.path,
      })
      return (
        <MalteHelpFormOffer
          categoryPageTitle={category.title}
          url={url}
          malteHelpFormOffer={offer}
          cityCode={cityCode}
          onSubmit={goBack}
        />
      )
    }
    default:
      return null
  }
}

export default EmbeddedOffers
