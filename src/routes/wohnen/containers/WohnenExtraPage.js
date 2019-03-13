// @flow

import * as React from 'react'

import type { StateType } from '../../../modules/app/StateType'
import { connect } from 'react-redux'
import { WohnenOfferModel, ExtraModel } from '@integreat-app/integreat-api-client'
import OfferDetail from '../components/OfferDetail'
import Caption from '../../../modules/common/components/Caption'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import OfferListItem from '../components/OfferListItem'
import List from '../../../modules/common/components/List'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import compose from 'lodash/fp/compose'
import { hash as hashFunction } from '../../../modules/app/route-configs/WohnenRouteConfig'

type PropsType = {|
  offers: Array<WohnenOfferModel>,
  city: string,
  language: string,
  offerHash?: string,
  extras: Array<ExtraModel>,
  t: TFunction
|}

export class WohnenExtraPage extends React.Component<PropsType> {
  renderOfferListItem = ({city, language, hashFunction}: {
    city: string, language: string,
    hashFunction: WohnenOfferModel => string
  }) => (offer: WohnenOfferModel) =>
    <OfferListItem key={hashFunction(offer)}
                   offer={offer}
                   language={language}
                   city={city}
                   hashFunction={hashFunction} />

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
              renderItem={this.renderOfferListItem({city, language, hashFunction})} />
      </>
    )
  }
}

const mapStateTypeToProps = (state: StateType) => ({
  city: state.location.payload.city,
  language: state.location.payload.language,
  offerHash: state.location.payload.offerHash
})

export default compose(
  connect(mapStateTypeToProps),
  withTranslation('wohnen')
)(WohnenExtraPage)
