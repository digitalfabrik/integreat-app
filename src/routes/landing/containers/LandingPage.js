import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import FilterableLocationSelector from 'routes/landing/components/FilterableLocationSelector'
import withFetcher from 'modules/endpoint/hocs/withFetcher'
import LocationModel from 'modules/endpoint/models/LocationModel'
import GeneralFooter from '../../../modules/layout/components/GeneralFooter'
import withLayout from '../../../modules/layout/hocs/withLayout'

export class LandingPage extends React.Component {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired,
    language: PropTypes.string.isRequired
  }

  render () {
    return <FilterableLocationSelector
          language={this.props.language}
          locations={this.props.locations} />
  }
}

const mapStateToProps = state => ({
  language: state.router.params && state.router.params.language ? state.router.params.language : 'de'
})

export default compose(
  withLayout(null, null, GeneralFooter),
  connect(mapStateToProps),
  withFetcher('locations')
)(LandingPage)
