// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import FilterableCitySelector from 'routes/landing/components/FilterableCitySelector'
import CityModel from 'modules/endpoint/models/CityModel'
import { translate } from 'react-i18next'
import ReactHelmet from 'react-helmet'
import type { I18nTranslateType, StateType } from '../../../flowTypes'

type PropsType = {
  cities: Array<CityModel>,
  language: string,
  t: I18nTranslateType
}

export class LandingPage extends React.Component<PropsType> {
  render () {
    const {t, language, cities} = this.props
    return <React.Fragment>
      <ReactHelmet>
        <title>{t('pageTitle')}</title>
        <meta name='description' content={t('metaDescription')} />
      </ReactHelmet>
      <FilterableCitySelector language={language} cities={cities} />
    </React.Fragment>
  }
}

const mapStateTypeToProps = (stateType: StateType) => ({
  language: stateType.location.payload.language,
  cities: stateType.cities.data
})

export default compose(
  connect(mapStateTypeToProps),
  translate('landing')
)(LandingPage)
