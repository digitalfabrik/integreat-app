// @flow

import * as React from 'react'

import Spinner from 'react-spinkit'
import Helmet from 'react-helmet'
import type { StateType } from 'modules/app/StateType'
import { connect } from 'react-redux'
import WohnenOfferModel from '../../../modules/endpoint/models/WohnenOfferModel'
import CityModel from '../../../modules/endpoint/models/CityModel'
import ExtraModel from '../../../modules/endpoint/models/ExtraModel'
import OfferList from '../components/OfferList'

type PropsType = {
  offers: Array<WohnenOfferModel>,
  city: string,
  language: string,
  extras: Array<ExtraModel>,
  cities: Array<CityModel>
}

class WohnenExtra extends React.Component<PropsType> {
  render () {
    const LoadingSpinner = () => <Spinner name='line-scale-party' />

    const {offers, extras, cities, city} = this.props
    const cityName = CityModel.findCityName(cities, city)
    const extra: ExtraModel | void = extras.find(extra => extra.alias === 'wohnen')

    if (!extra) {
      return null
    }

    return (
      <React.Fragment>
        <Helmet title={`${extra.title} - ${cityName}`} />
        {offers ? <OfferList title={extra.title} offers={offers} /> : <LoadingSpinner />}
      </React.Fragment>
    )
  }
}
const mapStateTypeToProps = (state: StateType) => ({
  city: state.location.payload.city,
  language: state.location.payload.language,
  extras: state.extras.data,
  cities: state.cities.data,
  offers: state.wohnen.data
})

export default connect(mapStateTypeToProps)(WohnenExtra)
