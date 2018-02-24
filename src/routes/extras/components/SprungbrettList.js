import React from 'react'
import PropTypes from 'prop-types'

import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'

import Caption from '../../../modules/common/components/Caption'
import SprungbrettListItem from './SprungbrettListItem'

class SprungbrettList extends React.Component {
  static propTypes = {
    jobs: PropTypes.arrayOf(PropTypes.instanceOf(SprungbrettJobModel)).isRequired,
    title: PropTypes.string
  }

  getListItems () {
    return this.props.jobs.map(job => <SprungbrettListItem key={job.title()} job={job} />)
  }

  render () {
    return (
      <div>
        {this.props.title && <Caption title={this.props.title} />}
        {this.getListItems()}
      </div>
    )
  }
}

export default SprungbrettList
