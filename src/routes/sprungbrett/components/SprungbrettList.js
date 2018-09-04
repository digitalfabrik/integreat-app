// @flow

import type { Node } from 'react'
import * as React from 'react'

import SprungbrettJobModel from 'modules/endpoint/models/SprungbrettJobModel'

import SprungbrettListItem from './SprungbrettListItem'
import Caption from '../../../modules/common/components/Caption'

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
      <>
        <Caption title={this.props.title} />
          {this.getListItems()}
      </>
    )
  }
}

export default SprungbrettList
