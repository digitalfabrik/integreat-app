import React from 'react'
import PropTypes from 'prop-types'

import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'

class SprungbrettListItem extends React.Component {
  static propTypes = {
    job: PropTypes.instanceOf(SprungbrettJobModel).isRequired
  }

  render () {
    const job = this.props.job

    return <a href={job.url}>
      <div>{job.title}</div>
    </a>
  }
}

export default SprungbrettListItem
