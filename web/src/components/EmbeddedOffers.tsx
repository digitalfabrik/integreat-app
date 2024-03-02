import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { MALTE_HELP_FORM_OFFER_ROUTE, SPRUNGBRETT_OFFER_ALIAS } from 'shared'
import { CategoryModel } from 'shared/api'

import { CityRouteProps } from '../CityContentSwitcher'
import MalteHelpFormOfferPage from '../routes/MalteHelpFormOfferPage'
import SprungbrettOfferPage from '../routes/SprungbrettOfferPage'

const Container = styled.div<{ withMargin: boolean }>`
  ${props => props.withMargin && 'margin-top: 48px;'}
`

type EmbeddedOffersProps = {
  category: CategoryModel
} & CityRouteProps

const EmbeddedOffer = ({ category, ...props }: EmbeddedOffersProps): ReactElement | null => {
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

const EmbeddedOffers = (embeddedOfferProps: EmbeddedOffersProps): ReactElement | null => {
  const { category } = embeddedOfferProps
  return (
    <Container withMargin={!!category.content}>
      <EmbeddedOffer {...embeddedOfferProps} />
    </Container>
  )
}

export default EmbeddedOffers
