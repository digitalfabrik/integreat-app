import React from 'react'
import PropTypes from 'prop-types'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import ExtraModel from 'modules/endpoint/models/ExtraModel'
import ExtraTiles from '../components/ExtraTiles'

export class ExtrasPage extends React.Component {
  static propTypes = {
    extras: PropTypes.arrayOf(PropTypes.instanceOf(ExtraModel)).isRequired
  }

  componentWillMount () {
    if (this.props.extras) {
      const sprungbrettExtra = this.props.extras.filter(extra => extra.type === 'ige-sbt')
      if (sprungbrettExtra) {

      }
    }
  }

  componentWillReceiveProps () {

  }

  render () {
    return <ExtraTiles extras={this.props.extras} />
  }
}

export default withFetcher('extras')(ExtrasPage)
