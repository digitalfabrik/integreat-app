// @flow

import * as React from 'react'
import { WohnenFormData, WohnenOfferModel } from 'api-client'
import ListItem from '../../../modules/common/components/ListItem'
import styled, { type StyledComponent } from 'styled-components'
import WohnenRouteConfig from '../../../modules/app/route-configs/WohnenRouteConfig'
import type { ThemeType } from 'build-configs/ThemeType'

const Description: StyledComponent<{||}, ThemeType, *> = styled.div`
  display: flex;
  flex-direction: column;
`

const Price: StyledComponent<{||}, ThemeType, *> = styled.span`
  align-self: flex-end;
`

type PropsType = {|
  offer: WohnenOfferModel,
  language: string,
  city: string,
  hashFunction: WohnenOfferModel => string
|}

class OfferListItem extends React.PureComponent<PropsType> {
  render() {
    const { offer, city, language, hashFunction } = this.props

    if (offer.formData instanceof WohnenFormData) {
      const hash = hashFunction(offer)
      const offerPath = new WohnenRouteConfig().getRoutePath({ city, language, offerHash: hash })
      const specificOffer: WohnenOfferModel = offer
      const accommodation = specificOffer.formData.accommodation
      const costs = specificOffer.formData.costs

      return (
        <ListItem path={offerPath} title={accommodation.title}>
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
