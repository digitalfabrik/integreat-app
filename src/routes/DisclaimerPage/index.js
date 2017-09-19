import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import Page from 'components/Content/Page'
import RichLayout from 'components/RichLayout'
import { DisclaimerFetcher } from 'endpoints'

class PageAdapter extends React.Component {
  render () {
    return <Page page={this.props.disclaimer}/>
  }
}

class DisclaimerPage extends React.Component {
  static propTypes = {
    language: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired
  }

  render () {
    return (
      <RichLayout location={this.props.location}>
        <DisclaimerFetcher>
          <PageAdapter/>
        </DisclaimerFetcher>
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

export default connect(mapStateToProps)(DisclaimerPage)
