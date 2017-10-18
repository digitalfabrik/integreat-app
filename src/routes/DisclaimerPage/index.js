import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import Page from 'components/Content/Page'
import RichLayout from 'components/RichLayout'
import PageModel from 'endpoints/models/PageModel'
import withFetcher from 'endpoints/withFetcher'
import DISCLAIMER_ENDPOINT from 'endpoints/events'

class DisclaimerPage extends React.Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    disclaimer: PropTypes.instanceOf(PageModel)
  }

  render () {
    return (
      <RichLayout location={this.props.location}>
        <Page page={this.props.disclaimer}/>
      </RichLayout>
    )
  }
}

function mapStateToProps (state) {
  return {
    language: state.router.params.language,
    location: state.router.params.location
  }
}

export default connect(mapStateToProps)(withFetcher(DISCLAIMER_ENDPOINT)(DisclaimerPage))
