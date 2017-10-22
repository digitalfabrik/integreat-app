import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import Layout from 'components/Layout'
import LOCATIONS_ENDPOINT from 'endpoints/location'
import FilterableLocation from 'components/Location/FilterableLocation'
import Footer from 'components/RichLayout/Footer'
import withFetcher from 'endpoints/withFetcher'
import LocationModel from 'endpoints/models/LocationModel'

class LandingPage extends React.Component {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.instanceOf(LocationModel)).isRequired,
    language: PropTypes.string.isRequired
  }

  render () {
    return (<div>
        <Layout>
          <FilterableLocation
            language={this.props.language}
            locations={this.props.locations}/>
        </Layout>
        <Footer/>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const language = state.router.params && state.router.params.language ? state.router.params.language : 'de'
  return {language}
}

export default compose(
  connect(mapStateToProps),
  withFetcher(LOCATIONS_ENDPOINT)
)(LandingPage)
