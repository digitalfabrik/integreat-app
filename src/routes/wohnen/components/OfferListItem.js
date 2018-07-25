// @flow

import React from 'react'
import WohnenOfferModel from 'modules/endpoint/models/WohnenOfferModel'
import WohnenFormData from 'modules/endpoint/models/WohnenFormData'
import styled from 'styled-components'
import ListElement from 'modules/common/components/ListElement'

type PropsType = {
  offer: WohnenOfferModel
}

const Description = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left: 10px;
  padding-bottom: 5px;
`

const Title = styled.div`
  padding: 15px 5px 5px;
  font-weight: 700;
`

const Price = styled.div`
  align-self: flex-end;
`

class OfferListItem extends React.Component<PropsType> {
  render () {
    const offer = this.props.offer

    if (offer.formData instanceof WohnenFormData) {
      const specificOffer: WohnenOfferModel = offer
      const accommodation = specificOffer.formData.accommodation
      const costs = specificOffer.formData.costs

      return <ListElement>
        <Title>{accommodation.title}</Title>
        <Description>
          <div>
            <div>{accommodation.totalArea} m²</div>
            <div>{accommodation.totalRooms} Zimmer</div>
          </div>
          <Price>{costs.baseRent} €</Price>
        </Description>
      </ListElement>
    } else {
      throw new Error(`Failed to render form ${JSON.stringify(offer.formData)} because it is not supported!`)
    }
  }
}

export default OfferListItem
