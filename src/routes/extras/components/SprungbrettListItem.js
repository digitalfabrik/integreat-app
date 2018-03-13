import React from 'react'
import PropTypes from 'prop-types'

import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'

import style from './SprungbrettListItem.css'

class SprungbrettListItem extends React.Component {
  static propTypes = {
    job: PropTypes.instanceOf(SprungbrettJobModel).isRequired
  }

  render () {
    const job = this.props.job

    return <a href={job.url} className={style.job} target='_blank' >
      <div className={style.title}>{job.title}</div>
      <div className={style.description}>{job.location}</div>
      </a>
  }
}

export default SprungbrettListItem
