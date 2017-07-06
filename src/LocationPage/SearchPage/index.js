import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Layout from 'Layout/Layout'
import LANGUAGE_ENDPOINT from 'endpoints/language'

class SearchPage extends React.Component {
  static propTypes = {
    language: PropTypes.string.isRequired
  }

  componentWillUnmount () {
    this.props.dispatch(LANGUAGE_ENDPOINT.invalidateAction())
  }

  componentWillMount () {
    let location = this.getLocation()
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
        TODO
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

export default connect(mapStateToProps)(SearchPage)
