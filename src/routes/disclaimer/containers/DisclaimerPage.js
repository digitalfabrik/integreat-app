import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import DisclaimerModel from 'modules/endpoint/models/DisclaimerModel'
import Page from 'modules/common/components/Page'

/**
 * Displays the locations disclaimer matching the route /<location>/<language>/disclaimer
 */
export class DisclaimerPage extends React.Component {
  static propTypes = {
    disclaimer: PropTypes.instanceOf(DisclaimerModel).isRequired
  }

  render () {
    return <Page title={this.props.disclaimer.title}
                 content={this.props.disclaimer.content} />
  }
}

const mapStateToProps = state => ({
  city: state.location.payload.city,
  disclaimer: state.disclaimer,
  languages: state.languages
})

export default connect(mapStateToProps)(DisclaimerPage)
