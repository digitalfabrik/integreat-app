import React from 'react'
import PropTypes from 'prop-types'

import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'

import SprungbrettListItem from './SprungbrettListItem'
import style from './SprungbrettList.css'

class SprungbrettList extends React.Component {
  static propTypes = {
    jobs: PropTypes.arrayOf(PropTypes.instanceOf(SprungbrettJobModel)).isRequired
  }

  getListItems () {
    return this.props.jobs.map(job => <SprungbrettListItem key={job.id} job={job} />)
  }

  render () {
    return (
      <div className={style.list} >
        {this.getListItems()}
      </div>
    )
  }
}

export default SprungbrettList
