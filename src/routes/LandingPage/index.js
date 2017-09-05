import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from 'components/Layout'
import { LocationFetcher } from 'endpoints'
import FilterableLocation from 'components/Location/FilterableLocation'

class LandingPage extends React.Component {
  static propTypes = {
    language: PropTypes.string
  }

  render () {
    return (
      <Layout>
        <LocationFetcher>
          <FilterableLocation language={this.props.language}/>
        </LocationFetcher>
      </Layout>
    )
  }
}

export default connect((state) => ({ language: state.router.params ? state.router.params.language : 'de' }))(LandingPage)
