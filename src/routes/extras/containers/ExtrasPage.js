import React from 'react'
import PropTypes from 'prop-types'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import ExtraModel from 'modules/endpoint/models/ExtraModel'
import ExtraTiles from '../components/ExtraTiles'

export class ExtrasPage extends React.Component {
  static propTypes = {
    extras: PropTypes.arrayOf(PropTypes.instanceOf(ExtraModel)).isRequired
  }

  render () {
    return <ExtraTiles extras={this.props.extras} />
  }
}

export default withFetcher('extras')(ExtrasPage)
