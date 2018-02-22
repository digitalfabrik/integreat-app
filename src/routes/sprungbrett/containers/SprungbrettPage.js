import React from 'react'
import PropTypes from 'prop-types'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'

export class SprungbrettPage extends React.Component {
  static propTypes = {
    jobs: PropTypes.arrayOf(PropTypes.instanceOf(SprungbrettJobModel))
  }

  render () {
    return <div>{this.props.jobs}</div>
  }
}

export default withFetcher('sprungbrett')(SprungbrettPage)
