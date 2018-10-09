// @flow

import type { Node } from 'react'
import * as React from 'react'

import SprungbrettJobModel from '../../../modules/endpoint/models/SprungbrettJobModel'

import Caption from '../../../modules/common/components/Caption'
import StyledList from '../../../modules/common/components/StyledList'
import ListElement from '../../../modules/common/components/ListElement'

type PropsType = {|
  jobs: Array<SprungbrettJobModel>,
  title: string
|}

class SprungbrettList extends React.Component<PropsType> {
  getListItems (): Array<Node> {
    return this.props.jobs.map(job => (
      <ListElement key={job.id} title={job.title} path={job.url} isExternalUrl>
        <div>{job.location}</div>
      </ListElement>
    ))
  }

  render () {
    return (
      <>
        <Caption title={this.props.title} />
        <StyledList>
          {this.getListItems()}
        </StyledList>
      </>
    )
  }
}

export default SprungbrettList
