import React from 'react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
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
    if (this.props.pagePayload.ready()) {
      return <div>{React.Children.map(this.props.children, (child) => React.cloneElement(child, {
        page: this.props.pagePayload.data,
        pagePayload: this.props.pagePayload
      }))}</div>
    } else {
      return <Spinner name='line-scale-party'/>
    }
  }
}

export default connect((state) => { return {pagePayload: state.pages, language: state.language.language} })(PageFetcher)
