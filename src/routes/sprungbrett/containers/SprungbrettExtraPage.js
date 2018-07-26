// @flow

import * as React from 'react'

import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'
import Helmet from 'modules/common/containers/Helmet'
import Spinner from 'react-spinkit'
import SprungbrettList from '../components/SprungbrettList'
import type { StateType } from 'modules/app/StateType'
import { connect } from 'react-redux'
import ExtraModel from 'modules/endpoint/models/ExtraModel'
import CityModel from 'modules/endpoint/models/CityModel'
import FailureSwitcher from 'modules/common/components/FailureSwitcher'

type PropsType = {
  sprungbrettJobs: ?Array<SprungbrettJobModel>,
  city: string,
  language: string,
  extras: Array<ExtraModel>,
  cities: Array<CityModel>
}

export class SprungbrettExtraPage extends React.Component<PropsType> {
  render () {
    const {sprungbrettJobs, extras, cities, city} = this.props
    const cityName = CityModel.findCityName(cities, city)
    const extra: ExtraModel | void = extras.find(extra => extra.alias === 'sprungbrett')

    if (!extra) {
      return <FailureSwitcher error={new Error('The Sprunbrett extra is not supported.')} />
    }

    return (
      <React.Fragment>
        <Helmet title={`${extra.title} - ${cityName}`} />
        {sprungbrettJobs ? <SprungbrettList title={extra.title} jobs={sprungbrettJobs} /> : <Spinner
          name='line-scale-party' />}
      </React.Fragment>
    )
  }
}

const mapStateTypeToProps = (state: StateType) => ({
  city: state.location.payload.city,
  language: state.location.payload.language,
  extras: state.extras.data,
  cities: state.cities.data,
  sprungbrettJobs: state.sprungbrettJobs.data
})

export default connect(mapStateTypeToProps)(SprungbrettExtraPage)
