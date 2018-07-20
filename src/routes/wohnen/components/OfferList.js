// @flow

import * as React from 'react'
import OfferListItem from './OfferListItem'
import Caption from 'modules/common/components/Caption'
import WohnenOfferModel from 'modules/endpoint/models/WohnenOfferModel'
import { getWohnenExtraPath } from '../../../modules/app/routes/wohnen'
import CleanLink from '../../../modules/common/components/CleanLink'

type PropsType = {
  offers: Array<WohnenOfferModel<*>>,
  city: string,
  language: string,
  title: string,
  hashFunction: WohnenOfferModel<*> => string
}

class OfferList extends React.Component<PropsType> {
  getListItems (): Array<React.Node> {
    const {offers, city, language} = this.props

    return offers.map(offer => {
      const hash = this.props.hashFunction(offer)
      const offerPath = getWohnenExtraPath(city, language, hash)
      return <CleanLink to={offerPath}>
        <OfferListItem key={offer.createdDate.milliseconds()} offer={offer} />
      </CleanLink>
    })
  }

  render () {
    return (
      <React.Fragment>
        <Caption title={this.props.title} />
        {this.getListItems()}
      </React.Fragment>
    )
  }
}

export default OfferList
