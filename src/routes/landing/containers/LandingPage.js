// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import FilterableCitySelector from 'routes/landing/components/FilterableCitySelector'
import CityModel from 'modules/endpoint/models/CityModel'
import { translate } from 'react-i18next'
import Helmet from 'react-helmet'
import type { I18nTranslate, State } from '../../../flowTypes'

type Props = {
  cities: Array<CityModel>,
  language: string,
  t: I18nTranslate
}

export class LandingPage extends React.Component<Props> {
  render () {
    const {t, language, cities} = this.props
    return <React.Fragment>
      <Helmet>
        <title>{t('pageTitle')}</title>
      </Helmet>
      <FilterableCitySelector language={language} cities={cities} />
    </React.Fragment>
  }
}

const mapStateToProps = (state: State) => ({
  language: state.location.payload.language,
  cities: state.cities.data
})

export default compose(
  connect(mapStateToProps),
  translate('landing')
)(LandingPage)
