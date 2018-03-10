import React from 'react'
import PropTypes from 'prop-types'

import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'

import SprungbrettListItem from './SprungbrettListItem'
import style from './SprungbrettList.css'
import Caption from '../../../modules/common/components/Caption'

class SprungbrettList extends React.Component {
  static propTypes = {
    jobs: PropTypes.arrayOf(PropTypes.instanceOf(SprungbrettJobModel)).isRequired,
    title: PropTypes.string.isRequired
  }

  getListItems () {
    return this.props.jobs.map(job => <SprungbrettListItem key={job.id} job={job} />)
  }

  render () {
    return (
      <React.Fragment >
        <Caption title={this.props.title} />
        <div className={style.list} >
          {this.getListItems()}
        </div>
      </React.Fragment>
    )
  }
}

export default SprungbrettList
