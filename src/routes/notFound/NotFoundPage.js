// @flow

import React from 'react'
import { connect } from 'react-redux'
import Failure from '../../modules/common/components/Failure'
import { goToI18nRedirect } from '../../modules/app/routes/i18nRedirect'
import LanguageSelector from '../../modules/common/containers/LanguageSelector'
import CityModel from '../../modules/endpoint/models/CityModel'

type Props = {
  city: string,
  language?: string,
  cities: Array<CityModel>,
  invalidCity: ?string
}

/**
 * Our error component, but since the name Error collides with the ES6 class, we've called it Failure
 */
export class NotFoundPage extends React.Component<Props> {
  getCityName (): ?string {
    const {city, cities} = this.props
    const cityModel = cities.find(_city => _city.code === city)
    if (cityModel) {
      return cityModel.name
    }
  }

  render () {
    const {invalidCity, language} = this.props
    if (language) {
      return <LanguageSelector verticalLayout title={this.getCityName()} />
    } else {
      return <Failure error={'not-found:page.notFound'} goTo={goToI18nRedirect()} notFound={invalidCity} />
    }
  }
}

const mapStateToProps = state => ({
  language: state.location.prev.payload.language,
  city: state.location.prev.payload.city,
  cities: state.cities,
  invalidCity: state.location.prev.payload.param
})

export default connect(mapStateToProps)(NotFoundPage)
