// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import DisclaimerModel from 'modules/endpoint/models/DisclaimerModel'
import Page from 'modules/common/components/Page'
import CityModel from '../../../modules/endpoint/models/CityModel'
import Helmet from 'react-helmet'
import { translate } from 'react-i18next'

type Props = {
  disclaimer: DisclaimerModel,
  cities: Array<CityModel>,
  city: string,
  t: string => string
}

/**
 * Displays the locations disclaimer matching the route /<location>/<language>/disclaimer
 */
export class DisclaimerPage extends React.Component<Props> {
  render () {
    const {disclaimer, cities, city, t} = this.props

    return <React.Fragment>
      <Helmet>
        <title>{t('pageTitle')} - {CityModel.findCityName(cities, city)}</title>
      </Helmet>
      <Page title={disclaimer.title}
            content={disclaimer.content} />
    </React.Fragment>
  }
}

const mapStateToProps = state => ({
  disclaimer: state.disclaimer.data,
  cities: state.cities.data,
  city: state.location.payload.city
})

export default compose(
  connect(mapStateToProps),
  translate('disclaimer')
)(DisclaimerPage)
