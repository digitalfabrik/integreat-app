import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import compose from 'lodash/fp/compose'

import Page from 'components/Content/Page'
import RichLayout from 'components/RichLayout'
import PageModel from 'endpoints/models/PageModel'
import withFetcher from 'endpoints/withFetcher'
import DISCLAIMER_ENDPOINT from 'endpoints/events'

class DisclaimerPage extends React.Component {
  static propTypes = {
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
  return {location: state.router.params.location}
}

export default compose(
  connect(mapStateToProps),
  withFetcher(DISCLAIMER_ENDPOINT)
)(DisclaimerPage)
