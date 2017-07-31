import React from 'react'
import PropTypes from 'prop-types'

import EndpointFetcher from 'components/EndpointFetcher'
import HeaderLayout from 'components/HeaderLayout'

import PAGE_ENDPOINT from 'endpoints/page'
import { connect } from 'react-redux'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

class PageLayout extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    location: PropTypes.string.isRequired,
  }

  componentDidUpdate () {
// eslint-disable-next-line
    window.scrollTo(0, 0)
  }

  render () {
    return (
      <HeaderLayout location={this.props.location}>
        <EndpointFetcher endpoint={PAGE_ENDPOINT} urlOptions={{
          location: this.props.location,
          language: this.props.language,
          since: BIRTH_OF_UNIVERSE
        }} transformOptions={{location: this.props.location}}
        />
        {this.props.children}
      </HeaderLayout>
    )
  }
}

function mapStateToProps (state) {
  return ({
    language: state.language.language
  })
}

export default connect(mapStateToProps)(PageLayout)
