// @flow

import * as React from 'react'
import { Text } from 'react-native'
import { WohnenOfferModel, WohnenFormData } from '@integreat-app/integreat-api-client'
import ListItem from '../../../modules/common/components/ListItem'
import styled from 'styled-components/native'
import { formatPrice } from './OfferDetail'

const Description = styled.View`
  flex: 1;
  flex-direction: column;
`

const Price = styled.Text`
  align-self: flex-end;
`

type PropsType = {|
  offer: WohnenOfferModel,
  navigateToOffer: () => void
|}

class OfferListItem extends React.PureComponent<PropsType> {
  render () {
    const {offer, navigateToOffer} = this.props

    if (offer.formData instanceof WohnenFormData) {
      const accommodation = offer.formData.accommodation
      const costs = offer.formData.costs

      return (
        <ListItem title={accommodation.title} navigateTo={navigateToOffer}>
          <Description>
            <Text>{accommodation.totalArea} m²</Text>
            <Text>{accommodation.totalRooms} Zimmer</Text>
            <Price>{formatPrice(costs.baseRent)} €</Price>
          </Description>
        </ListItem>
      )
    } else {
      throw new Error(`Failed to render form ${JSON.stringify(offer.formData)} because it is not supported!`)
    }
  }
}

export default OfferListItem
