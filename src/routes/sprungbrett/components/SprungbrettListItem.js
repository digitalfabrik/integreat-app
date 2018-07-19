// @flow

import React from 'react'

import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'

import style from './SprungbrettListItem.css'

type PropsType = {
  job: SprungbrettJobModel
}

class SprungbrettListItem extends React.Component<PropsType> {
  render () {
    const job = this.props.job

    return <a href={job.url} className={style.job} target='_blank' >
      <div className={style.title}>{job.title}</div>
      <div className={style.description}>{job.location}</div>
      </a>
  }
}

export default SprungbrettListItem
