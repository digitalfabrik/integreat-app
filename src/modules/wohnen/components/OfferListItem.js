// @flow

import * as React from 'react'
import { WohnenOfferModel, WohnenFormData } from '@integreat-app/integreat-api-client'
import ListItem from '../../../modules/common/components/ListItem'
import styled from 'styled-components'

const Description = styled.View`
  display: flex;
  flex-direction: column;
`

const Price = styled.Text`
  align-self: flex-end;
`

type PropsType = {|
  offer: WohnenOfferModel,
  hashFunction: WohnenOfferModel => string,
  navigateToOffer: () => void
|}

class OfferListItem extends React.PureComponent<PropsType> {
  render () {
    const {offer, navigateToOffer} = this.props

    if (offer.formData instanceof WohnenFormData) {
      const specificOffer: WohnenOfferModel = offer
      const accommodation = specificOffer.formData.accommodation
      const costs = specificOffer.formData.costs

      return (
        <ListItem title={accommodation.title} navigateTo={navigateToOffer}>
          <Description>
            <div>{accommodation.totalArea} m²</div>
            <div>{accommodation.totalRooms} Zimmer</div>
            <Price>{costs.baseRent} €</Price>
          </Description>
        </ListItem>
      )
    } else {
      throw new Error(`Failed to render form ${JSON.stringify(offer.formData)} because it is not supported!`)
    }
  }
}

export default OfferListItem
