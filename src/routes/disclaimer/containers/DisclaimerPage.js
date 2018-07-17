// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import DisclaimerModel from 'modules/endpoint/models/DisclaimerModel'
import Page from 'modules/common/components/Page'
import CityModel from '../../../modules/endpoint/models/CityModel'
import { translate } from 'react-i18next'
import type { I18nTranslateType, StateType } from '../../../flowTypes'
import Helmet from '../../../modules/common/containers/Helmet'
import CategoryTimeStamp from '../../categories/components/CategoryTimeStamp'

type PropsType = {
  disclaimer: DisclaimerModel,
  cities: Array<CityModel>,
  city: string,
  t: I18nTranslateType,
  language: string
}

/**
 * Displays the locations disclaimer matching the route /<location>/<language>/disclaimer
 */
export class DisclaimerPage extends React.Component<PropsType> {
  render () {
    const {disclaimer, cities, city, t, language} = this.props

    return <React.Fragment>
      <Helmet title={`${t('pageTitle')} - ${CityModel.findCityName(cities, city)}`} />
      <Page title={disclaimer.title}
            content={disclaimer.content} />
      <CategoryTimeStamp lastUpdate={disclaimer.lastUpdate} language={language} />
    </React.Fragment>
  }
}

const mapStateTypeToProps = (stateType: StateType) => ({
  disclaimer: stateType.disclaimer.data,
  cities: stateType.cities.data,
  city: stateType.location.payload.city,
  language: stateType.location.payload.language
})

export default compose(
  connect(mapStateTypeToProps),
  translate('disclaimer')
)(DisclaimerPage)
