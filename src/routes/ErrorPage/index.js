import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from 'components/Layout/Layout'
import Error from 'components/Error/Error'
import LANGUAGE_ENDPOINT from 'endpoints/language'

class ErrorPage extends React.Component {
  static propTypes = {
    language: PropTypes.string.isRequired
  }

  componentWillUnmount () {
    this.props.dispatch(LANGUAGE_ENDPOINT.invalidateAction())
  }

  componentWillMount () {
    let location = this.getLocation()
    if (!location) {
      // Don't fetch language options if we have an invalid URL for example
      return
    }
    this.props.dispatch(LANGUAGE_ENDPOINT.fetchEndpointAction({
      location: location,
      language: this.props.language
    }))
  }

  getLocation () {
    return this.props.match.params.location
  }

  render () {
    return (
      <Layout currentLanguage={this.props.language}>
        <Error error="errors:page.notFound"/>
      </Layout>
    )
  }
}

/**
 * @param state The current app state
 * @return {{locations: {}}}  The endpoint values from the state mapped to props
 */
function mapStateToProps (state) {
  return ({
    language: state.language.language
  })
}

export default connect(mapStateToProps)(ErrorPage)
