import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import LANGUAGE_ENDPOINT from 'endpoints/language'
import Payload from 'endpoints/Payload'

class PageFetcher extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    languagePayload: PropTypes.instanceOf(Payload).isRequired
  }

  componentWillUnmount () {
    this.props.dispatch(LANGUAGE_ENDPOINT.invalidateAction())
  }

  componentWillMount () {
    this.props.dispatch(LANGUAGE_ENDPOINT.fetchEndpointAction({
      location: this.props.location,
      language: this.props.language
    }))
  }

  render () {
    return React.cloneElement(React.Children.only(this.props.children), {languagePayload: this.props.languagePayload})
  }
}

export default connect((state) => { return {languagePayload: state.languages} })(PageFetcher)
