// @flow

import * as React from 'react'
import OfferListItem from './OfferListItem'
import WohnenOfferModel from 'modules/endpoint/models/WohnenOfferModel'
import { getWohnenExtraPath } from '../../../modules/app/routes/wohnen'
import CleanLink from '../../../modules/common/components/CleanLink'

type PropsType = {
  offers: Array<WohnenOfferModel>,
  city: string,
  language: string,
  hashFunction: WohnenOfferModel => string
}

// fixme: OfferList is connected to redux state because of Link -> not a plain old component

class OfferList extends React.Component<PropsType> {
  render () {
    const {offers, city, language} = this.props

    return offers.map(offer => {
      const hash = this.props.hashFunction(offer)
      const offerPath = getWohnenExtraPath(city, language, hash)
      return <CleanLink key={offer.createdDate.milliseconds()} to={offerPath}>
        <OfferListItem offer={offer} />
      </CleanLink>
    })
  }
}

export default OfferList
