import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Fetcher from 'components/Fetcher'
import HeaderLayout from 'components/HeaderLayout'

import PAGE_ENDPOINT from 'endpoints/page'

const BIRTH_OF_UNIVERSE = new Date(0).toISOString().split('.')[0] + 'Z'

class PageLayout extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    location: PropTypes.string.isRequired
  }

  componentDidUpdate () {
// eslint-disable-next-line
    window.scrollTo(0, 0)
  }

  getUrlOptions () {
    return {
      location: this.props.location,
      language: this.props.language,
      since: BIRTH_OF_UNIVERSE
    }
  }

  getTransformOptions () {
    return {
      location: this.props.location
    }
  }

  render () {
    return (
      <Fetcher endpoint={PAGE_ENDPOINT}
               urlOptions={this.getUrlOptions()}
               transformOptions={this.getTransformOptions()}>
        <HeaderLayout className={this.props.className} location={this.props.location}>
          {this.props.children}>
        </HeaderLayout>
      </Fetcher>
    )
  }
}

function mapStateToProps (state) {
  return ({
    language: state.language.language
  })
}

export default connect(mapStateToProps)(PageLayout)
