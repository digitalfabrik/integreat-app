// @flow

import * as React from 'react'

import Spinner from 'react-spinkit'
import Helmet from 'react-helmet'
import type { StateType } from 'modules/app/StateType'
import { connect } from 'react-redux'
import WohnenOfferModel from 'modules/endpoint/models/WohnenOfferModel'
import CityModel from 'modules/endpoint/models/CityModel'
import ExtraModel from 'modules/endpoint/models/ExtraModel'
import OfferList from '../components/OfferList'
import OfferDetail from '../components/OfferDetail'
import Hashids from 'hashids'
import Caption from 'modules/common/components/Caption'
import FailureSwitcher from 'modules/common/components/FailureSwitcher'

type PropsType = {
  offers: ?Array<WohnenOfferModel>,
  city: string,
  language: string,
  offerHash?: string,
  extras: Array<ExtraModel>,
  cities: Array<CityModel>
}

export class WohnenExtraPage extends React.Component<PropsType> {
  hashids = new Hashids()
  hash = (offer: WohnenOfferModel) => this.hashids.encode(offer.email.length, offer.createdDate.seconds())

  findOfferByHash (offers: Array<WohnenOfferModel>, hash: string): WohnenOfferModel | void {
    return offers.find(offer => this.hash(offer) === hash)
  }

  render () {
    const {offers, extras, cities, city, language, offerHash} = this.props
    const cityName = CityModel.findCityName(cities, city)
    const extra: ExtraModel | void = extras.find(extra => extra.alias === 'wohnen')

    if (!extra) {
      return <FailureSwitcher error={new Error('The Wohnen extra is not supported.')} />
    }

    if (!offers) {
      return <Spinner name='line-scale-party' />
    }

    if (offerHash) {
      const offer = this.findOfferByHash(offers, offerHash)

      if (!offer) {
        return <FailureSwitcher error={new Error('Angebot nicht gefunden.')} />
      }

      return (
        <React.Fragment>
          <Helmet title={`${offer.formData.accommodation.title} - ${extra.title} - ${cityName}`} />
          {<OfferDetail offer={offer} />}
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <Helmet title={`${extra.title} - ${cityName}`} />
        <Caption title={extra.title} />
        <OfferList city={city} language={language}
                   hashFunction={this.hash}
                   offers={offers} />
      </React.Fragment>
    )
  }
}

const mapStateTypeToProps = (state: StateType) => ({
  city: state.location.payload.city,
  language: state.location.payload.language,
  offerHash: state.location.payload.offerHash,
  extras: state.extras.data,
  cities: state.cities.data,
  offers: state.wohnen.data
})

export default connect(mapStateTypeToProps)(WohnenExtraPage)
