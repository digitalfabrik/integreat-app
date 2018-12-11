// @flow

import * as React from 'react'

import { WohnenOfferModel, ExtraModel } from '@integreat-app/integreat-api-client'
import OfferDetail from './OfferDetail'
import Caption from '../../common/components/Caption'
import FailureSwitcher from '../../common/components/FailureSwitcher'
import OfferListItem from './OfferListItem'
import List from '../../../modules/common/components/List'
import type { TFunction } from 'react-i18next'
import { hash as hashFunction } from '../../extras/ExtrasConfig'

type PropsType = {|
  offers: Array<WohnenOfferModel>,
  city: string,
  language: string,
  offerHash?: WohnenOfferModel,
  extras: Array<ExtraModel>,
  navigateToOffer: (offerHash: string) => void,
  t: TFunction
|}

class WohnenExtra extends React.Component<PropsType> {
  renderOfferListItem = ({city, language, hashFunction}: {
    city: string, language: string,
    hashFunction: WohnenOfferModel => string
  }) => (offer: WohnenOfferModel) => {
    const hashedOffer = hashFunction(offer)
    return (
      <OfferListItem key={hashedOffer}
                     offer={offer}
                     hashFunction={hashFunction}
                     navigateToOffer={this.navigateToOffer(hashedOffer)} />)
  }

  navigateToOffer = (offerHash: string) => () => {
    this.props.navigateToOffer(offerHash)
  }

  render () {
    const {offers, extras, city, language, offerHash, t} = this.props
    const extra: ExtraModel | void = extras.find(extra => extra.alias === 'wohnen')

    if (!extra) {
      return <FailureSwitcher error={new Error('The Wohnen extra is not supported.')} />
    }

    if (offerHash) {
      const offer = offers.find(_offer => hashFunction(_offer) === offerHash)

      if (!offer) {
        return <FailureSwitcher error={new Error('Angebot nicht gefunden.')} />
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
              renderItem={this.renderOfferListItem({city, language, hashFunction, offerHash})} />
      </>
    )
  }
}

export default WohnenExtra
