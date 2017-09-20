import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from 'components/Layout'
import { LocationFetcher } from 'endpoints'
import FilterableLocation from 'components/Location/FilterableLocation'
import Footer from 'components/RichLayout/Footer'

class LandingPage extends React.Component {
  static propTypes = {
    language: PropTypes.string
  }

  render () {
    return (<div>
        <Layout>
          <LocationFetcher>
            <FilterableLocation language={this.props.language}/>
          </LocationFetcher>
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

export default connect(mapStateToProps)(LandingPage)
