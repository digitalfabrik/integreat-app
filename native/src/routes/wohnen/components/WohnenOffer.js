// @flow

import * as React from 'react'
import type { TFunction } from 'react-i18next'
import { WohnenOfferModel } from 'api-client'
import OfferDetail from './OfferDetail'
import Caption from '../../../modules/common/components/Caption'
import OfferListItem from './OfferListItem'
import List from '../../../modules/common/components/List'
import { hashWohnenOffer } from '../../offers/hashWohnenOffer'
import Failure from '../../../modules/error/components/Failure'
import type { ThemeType } from '../../../modules/theme/constants'
import ErrorCodes from '../../../modules/error/ErrorCodes'

type PropsType = {|
  offers: Array<WohnenOfferModel>,
  offerHash?: WohnenOfferModel,
  title: string,
  language: string,
  navigateToOffer: (offerHash: string) => void,
  t: TFunction,
  theme: ThemeType
|}

class WohnenOffer extends React.Component<PropsType> {
  renderOfferListItem = (offer: WohnenOfferModel) => {
    const hashedOffer = hashWohnenOffer(offer)
    return (
      <OfferListItem key={hashedOffer}
                     offer={offer}
                     language={this.props.language}
                     navigateToOffer={this.navigateToOffer(hashedOffer)}
                     theme={this.props.theme} />)
  }

  navigateToOffer = (offerHash: string) => () => {
    this.props.navigateToOffer(offerHash)
  }

  render () {
    const { offers, title, offerHash, t, theme } = this.props

    if (offerHash) {
      const offer = offers.find(_offer => hashWohnenOffer(_offer) === offerHash)

      if (!offer) {
        return <Failure errorMessage='Angebot nicht gefunden.' code={ErrorCodes.PageNotFound} t={t}
                        theme={theme} />
      }

      return (
        <OfferDetail offer={offer} theme={theme} />
      )
    }

    return (
      <>
        <Caption title={title} theme={theme} />
        <List noItemsMessage={t('noOffersAvailable')}
              items={offers}
              renderItem={this.renderOfferListItem}
              theme={theme} />
      </>
    )
  }
}

export default WohnenOffer
