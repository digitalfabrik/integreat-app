import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import PAGE_ENDPOINT from 'endpoints/page'
import Payload from 'endpoints/Payload'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

class PageFetcher extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    language: PropTypes.string.isRequired,
    pagePayload: PropTypes.instanceOf(Payload).isRequired
  }

  componentWillUnmount () {
    this.props.dispatch(PAGE_ENDPOINT.invalidateAction())
  }

  componentWillMount () {
    this.props.dispatch(PAGE_ENDPOINT.fetchEndpointAction({
      location: this.props.location,
      language: this.props.language,
      since: BIRTH_OF_UNIVERSE
    }, {
      location: this.props.location
    }))
  }

  render () {
    return React.cloneElement(React.Children.only(this.props.children), {pagePayload: this.props.pagePayload})
  }
}

export default connect((state) => { return {pagePayload: state.pages} })(PageFetcher)
