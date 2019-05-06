// @flow

import * as React from 'react'

import { WohnenOfferModel, ExtraModel } from '@integreat-app/integreat-api-client'
import OfferDetail from './OfferDetail'
import Caption from '../../common/components/Caption'
import OfferListItem from './OfferListItem'
import List from '../../../modules/common/components/List'
import type { TFunction } from 'react-i18next'
import { hashWohnenOffer } from '../../../routes/extras/hashWohnenOffer'
import Failure from '../../error/components/Failure'
import { WOHNEN_EXTRA } from '../../../routes/extras/constants'

type PropsType = {|
  offers: Array<WohnenOfferModel>,
  offerHash?: WohnenOfferModel,
  extras: Array<ExtraModel>,
  navigateToOffer: (offerHash: string) => void,
  t: TFunction
|}

class WohnenExtra extends React.Component<PropsType> {
  renderOfferListItem = (offer: WohnenOfferModel) => {
    const hashedOffer = hashWohnenOffer(offer)
    return (
      <OfferListItem key={hashedOffer}
                     offer={offer}
                     navigateToOffer={this.navigateToOffer(hashedOffer)} />)
  }

  navigateToOffer = (offerHash: string) => () => {
    this.props.navigateToOffer(offerHash)
  }

  render () {
    const {offers, extras, offerHash, t} = this.props
    const extra: ExtraModel | void = extras.find(extra => extra.alias === WOHNEN_EXTRA)

    if (!extra) {
      return <Failure error={new Error('The Wohnen extra is not supported.')} />
    }

    if (offerHash) {
      const offer = offers.find(_offer => hashWohnenOffer(_offer) === offerHash)

      if (!offer) {
        return <Failure error={new Error('Angebot nicht gefunden.')} />
      }

      return (
        <OfferDetail offer={offer} />
      )
    }

    return (
      <>
        <Caption title={extra.title} />
        <List noItemsMessage={t('noOffersAvailable')}
              items={offers}
              renderItem={this.renderOfferListItem} />
      </>
    )
  }
}

export default WohnenExtra
