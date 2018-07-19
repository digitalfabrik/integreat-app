// @flow

import * as React from 'react'

import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'

import SprungbrettListItem from './SprungbrettListItem'
import style from './SprungbrettList.css'
import Caption from '../../../modules/common/components/Caption'

import type { Node } from 'react'

type PropsType = {
  jobs: Array<SprungbrettJobModel>,
  title: string
}

class SprungbrettList extends React.Component<PropsType> {
  getListItems (): Array<Node> {
    return this.props.jobs.map(job => <SprungbrettListItem key={job.id} job={job} />)
  }

  render () {
    return (
      <React.Fragment >
        <Caption title={this.props.title} />
        <div className={style.list}>
          {this.getListItems()}
        </div>
      </React.Fragment>
    )
  }
}

export default SprungbrettList
