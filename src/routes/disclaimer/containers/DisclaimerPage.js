// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import DisclaimerModel from 'modules/endpoint/models/DisclaimerModel'
import Page from 'modules/common/components/Page'
import CityModel from '../../../modules/endpoint/models/CityModel'
import { translate } from 'react-i18next'
import type { I18nTranslate, State } from '../../../flowTypes'
import Helmet from '../../../modules/common/containers/Helmet'

type Props = {
  disclaimer: DisclaimerModel,
  cities: Array<CityModel>,
  city: string,
  t: I18nTranslate
}

/**
 * Displays the locations disclaimer matching the route /<location>/<language>/disclaimer
 */
export class DisclaimerPage extends React.Component<Props> {
  render () {
    const {disclaimer, cities, city, t} = this.props

    return <React.Fragment>
      <Helmet title={`${t('pageTitle')} - ${CityModel.findCityName(cities, city)}`} />
      <Page title={disclaimer.title}
            content={disclaimer.content} />
    </React.Fragment>
  }
}

const mapStateToProps = (state: State) => ({
  disclaimer: state.disclaimer.data,
  cities: state.cities.data,
  city: state.location.payload.city
})

export default compose(
  connect(mapStateToProps),
  translate('disclaimer')
)(DisclaimerPage)
