// @flow

import * as React from 'react'

import OfferListItem from './OfferListItem'
import Caption from '../../../modules/common/components/Caption'

import type { Node } from 'react'
import WohnenOfferModel from '../../../modules/endpoint/models/WohnenOfferModel'

type PropsType = {
  offers: Array<WohnenOfferModel<*>>,
  title: string
}

class OfferList extends React.Component<PropsType> {
  getListItems (): Array<Node> {
    return this.props.offers.map(offer => <OfferListItem key={offer.createdDate.utc().seconds()} offer={offer} />)
  }

  render () {
    return (
      <React.Fragment >
        <Caption title={this.props.title} />
          {this.getListItems()}
      </React.Fragment>
    )
  }
}

export default OfferList
