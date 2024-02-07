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

type EmbeddedOfferProps = {
  category: CategoryModel
} & CityRouteProps

const EmbeddedOffers = ({ category, ...props }: EmbeddedOfferProps): ReactElement | null => {
  const offer = category.embeddedOffers[0]
  const withMargin = !!category.content && category.content.length > 0
  switch (offer?.alias) {
    case SPRUNGBRETT_OFFER_ALIAS:
      return (
        <Container withMargin={withMargin}>
          <SprungbrettOfferPage {...props} embedded />
        </Container>
      )
    case MALTE_HELP_FORM_OFFER_ROUTE:
      return (
        <Container withMargin={withMargin}>
          <MalteHelpFormOfferPage {...props} categoryPageTitle={category.title} embedded />
        </Container>
      )
    default:
      return null
  }
}

export default EmbeddedOffers
