// @flow

import React from 'react'
import type { Node } from 'react'

import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'

import SprungbrettListItem from './SprungbrettListItem'
import style from './SprungbrettList.css'

type Props = {
  jobs: Array<SprungbrettJobModel>
}

class SprungbrettList extends React.Component<Props> {
  getListItems (): Array<Node> {
    return this.props.jobs.map(job => <SprungbrettListItem key={job.id} job={job} />)
  }

  render () {
    return (
      <div className={style.list}>
        {this.getListItems()}
      </div>
    )
  }
}

export default SprungbrettList
