import { styled } from '@mui/material/styles'
import React, { ReactElement } from 'react'

import { MALTE_HELP_FORM_OFFER_ALIAS, SPRUNGBRETT_OFFER_ALIAS } from 'shared'
import { CategoryModel } from 'shared/api'

import { CityRouteProps } from '../CityContentSwitcher'
import MalteHelpForm from './MalteHelpForm'
import SprungbrettOffer from './SprungbrettOffer'

const Container = styled('div')<{ withMargin: boolean }>`
  ${props => props.withMargin && 'margin-top: 48px;'}
`

type EmbeddedOffersProps = {
  category: CategoryModel
} & CityRouteProps

const EmbeddedOffer = ({ category, ...props }: EmbeddedOffersProps): ReactElement | null => {
  const offer = category.embeddedOffers[0]
  switch (offer?.alias) {
    case SPRUNGBRETT_OFFER_ALIAS:
      return <SprungbrettOffer sprungbrettOffer={offer} />
    case MALTE_HELP_FORM_OFFER_ALIAS:
      return <MalteHelpForm pageTitle={category.title} malteHelpFormOffer={offer} {...props} />
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
