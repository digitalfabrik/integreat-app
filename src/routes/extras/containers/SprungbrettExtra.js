import React from 'react'
import PropTypes from 'prop-types'

import withFetcher from 'modules/endpoint/hocs/withFetcher'
import JobModel from 'modules/endpoint/models/JobModel'

export class SprungbrettExtra extends React.Component {
  static propTypes = {
    jobs: PropTypes.arrayOf(PropTypes.instanceOf(JobModel))
  }

  render () {
    return this.props.jobs
  }
}

export default withFetcher('jobs')(SprungbrettExtra)
