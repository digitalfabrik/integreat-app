// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import FilterableCitySelector from '../../landing/components/FilterableCitySelector'
import CityModel from '../../../modules/endpoint/models/CityModel'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import ReactHelmet from 'react-helmet'
import type { StateType } from '../../../modules/app/StateType'

type PropsType = {
  cities: Array<CityModel>,
  language: string,
  t: TFunction
}

export class LandingPage extends React.Component<PropsType> {
  render () {
    const {t, language, cities} = this.props
    return <>
      <ReactHelmet>
        <title>{t('pageTitle')}</title>
        <meta name='description' content={t('metaDescription')} />
      </ReactHelmet>
      <FilterableCitySelector language={language} cities={cities} />
    </>
  }
}

const mapStateTypeToProps = (state: StateType) => ({
  language: state.location.payload.language
})

export default compose(
  connect(mapStateTypeToProps),
  translate('landing')
)(LandingPage)
