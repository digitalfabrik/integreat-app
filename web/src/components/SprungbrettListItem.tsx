import * as React from 'react'
import { ReactNode } from 'react'

import { SprungbrettJobModel } from 'api-client'

import ListItem from './ListItem'

type PropsType = {
  job: SprungbrettJobModel
}

class SprungbrettListItem extends React.PureComponent<PropsType> {
  render(): ReactNode {
    const { job } = this.props
    return (
      <ListItem title={job.title} path={job.url}>
        <div dir='auto'>{job.location}</div>
      </ListItem>
    )
  }
}

export default SprungbrettListItem
