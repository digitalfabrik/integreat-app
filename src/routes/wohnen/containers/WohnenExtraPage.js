// @flow

import * as React from 'react'

import Helmet from 'react-helmet'
import type { StateType } from '../../../modules/app/StateType'
import { connect } from 'react-redux'
import WohnenOfferModel from '../../../modules/endpoint/models/WohnenOfferModel'
import CityModel from '../../../modules/endpoint/models/CityModel'
import ExtraModel from '../../../modules/endpoint/models/ExtraModel'
import OfferDetail from '../components/OfferDetail'
import Hashids from 'hashids'
import Caption from '../../../modules/common/components/Caption'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import OfferListItem from '../components/OfferListItem'
import List from '../../../modules/common/components/List'
import { translate } from 'react-i18next'
import compose from 'lodash/fp/compose'
import type { TFunction } from 'react-i18next'

type PropsType = {|
  offers: Array<WohnenOfferModel>,
  city: string,
  language: string,
  offerHash?: string,
  extras: Array<ExtraModel>,
  cities: Array<CityModel>,
  t: TFunction
|}

export class WohnenExtraPage extends React.Component<PropsType> {
  hashids = new Hashids()
  hash = (offer: WohnenOfferModel) => this.hashids.encode(offer.email.length, offer.createdDate.seconds())

  findOfferByHash (offers: Array<WohnenOfferModel>, hash: string): WohnenOfferModel | void {
    return offers.find(offer => this.hash(offer) === hash)
  }

  renderOfferListItem = ({city, language, hashFunction}: {city: string, language: string,
    hashFunction: WohnenOfferModel => string}) => (offer: WohnenOfferModel) =>
    <OfferListItem key={hashFunction(offer)}
                   offer={offer}
                   language={language}
                   city={city}
                   hashFunction={hashFunction} />

  render () {
    const {offers, extras, cities, city, language, offerHash, t} = this.props
    const cityName = CityModel.findCityName(cities, city)
    const extra: ExtraModel | void = extras.find(extra => extra.alias === 'wohnen')

    if (!extra) {
      return <FailureSwitcher error={new Error('The Wohnen extra is not supported.')} />
    }

    if (offerHash) {
      const offer = this.findOfferByHash(offers, offerHash)

      if (!offer) {
        return <FailureSwitcher error={new Error('Angebot nicht gefunden.')} />
      }

      return (
        <>
          <Helmet title={`${offer.formData.accommodation.title} - ${extra.title} - ${cityName}`} />
          <OfferDetail offer={offer} />
        </>
      )
    }

    return (
      <>
        <Helmet title={`${extra.title} - ${cityName}`} />
        <Caption title={extra.title} />
        <List noItemsMessage={t('noOffersAvailable')}
              items={offers}
              renderItem={this.renderOfferListItem({city, language, hashFunction: this.hash})} />
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
  translate('wohnen')
)(WohnenExtraPage)
