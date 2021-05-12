// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import FilterableCitySelector from '../../landing/components/FilterableCitySelector'
import { CityModel } from 'api-client'
import type { StateType } from '../../../modules/app/StateType'

type PropsType = {|
  cities: Array<CityModel>,
  language: string
|}

export class LandingPage extends React.Component<PropsType> {
  render() {
    const { language, cities } = this.props
    return <FilterableCitySelector language={language} cities={cities} />
  }
}

const mapStateTypeToProps = (state: StateType) => ({
  language: state.location.payload.language
})

export default connect<*, *, *, *, *, *>(mapStateTypeToProps)(LandingPage)
