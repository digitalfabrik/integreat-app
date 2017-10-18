import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import Page from 'components/Content/Page'
import RichLayout from 'components/RichLayout'
import PageModel from 'endpoints/models/PageModel'
import withFetcher from 'endpoints/withFetcher'
import DISCLAIMER_ENDPOINT from 'endpoints/disclaimer'

class ContentWrapper extends React.Component {
  static propTypes = {
    disclaimer: PropTypes.instanceOf(PageModel) // From withFetcher
  }

  render () {
    return <Page page={this.props.disclaimer}/>
  }
}

const FetchingContentWrapper = withFetcher(DISCLAIMER_ENDPOINT)(ContentWrapper)

class DisclaimerPage extends React.Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    disclaimer: PropTypes.instanceOf(PageModel)
  }

  render () {
    return (
      <RichLayout location={this.props.location}>
        <FetchingContentWrapper/>
      </RichLayout>
    )
  }
}

function mapStateToProps (state) {
  return {location: state.router.params.location}
}

export default connect(mapStateToProps)(DisclaimerPage)
