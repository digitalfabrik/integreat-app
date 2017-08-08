import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from 'react-spinkit'

import DISCLAIMER_ENDPOINT from 'endpoints/disclaimer'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

class DisclaimerFetcher extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired
  }

  componentWillUnmount () {
    this.props.dispatch(DISCLAIMER_ENDPOINT.invalidateAction())
  }

  componentWillMount () {
    this.props.dispatch(DISCLAIMER_ENDPOINT.fetchEndpointAction({
      location: this.props.location,
      language: this.props.language,
      since: BIRTH_OF_UNIVERSE
    }, {
      location: this.props.location
    }))
  }

  render () {
    if (this.props.disclaimerPayload.ready()) {
      return React.cloneElement(React.Children.only(this.props.children), {disclaimer: this.props.disclaimerPayload.data})
    } else {
      return <Spinner name='line-scale-party'/>
    }
  }
}

export default connect((state) => { return {disclaimerPayload: state.disclaimer, language: state.language.language} })(DisclaimerFetcher)
