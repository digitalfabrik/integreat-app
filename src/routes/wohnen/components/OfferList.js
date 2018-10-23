// @flow

import * as React from 'react'
import OfferListItemInfo from './OfferListItemInfo'
import WohnenOfferModel from '../../../modules/endpoint/models/WohnenOfferModel'
import { getWohnenExtraPath } from '../../../modules/app/routes/wohnen'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import WohnenFormData from '../../../modules/endpoint/models/WohnenFormData'
import ListItem from '../../../modules/common/components/ListItem'
import List from '../../../modules/common/components/List'

type PropsType = {|
  offers: Array<WohnenOfferModel>,
  city: string,
  language: string,
  hashFunction: WohnenOfferModel => string,
  t: TFunction
|}

export class OfferList extends React.Component<PropsType> {
  renderOffer (offer: WohnenOfferModel): React.Node {
    const {city, language} = this.props

    if (offer.formData instanceof WohnenFormData) {
      const hash = this.props.hashFunction(offer)
      const offerPath = getWohnenExtraPath(city, language, hash)
      const specificOffer: WohnenOfferModel = offer
      const accommodation = specificOffer.formData.accommodation
      const costs = specificOffer.formData.costs

      return (
        <ListItem key={hash} path={offerPath} title={accommodation.title}>
          <OfferListItemInfo baseRent={costs.baseRent}
                             totalRooms={accommodation.totalRooms}
                             totalArea={accommodation.totalArea} />
        </ListItem>
      )
    } else {
      throw new Error(`Failed to render form ${JSON.stringify(offer.formData)} because it is not supported!`)
    }
  }

  render () {
    const {offers, t} = this.props
    return (
      <List noItemsMessage={t('noOffersAvailable')}>
        {offers.map(offer => this.renderOffer(offer))}
      </List>
    )
  }
}

export default translate('wohnen')(OfferList)
