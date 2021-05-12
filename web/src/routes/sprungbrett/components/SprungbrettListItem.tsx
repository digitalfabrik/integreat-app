// @flow

import * as React from 'react'

import { SprungbrettJobModel } from 'api-client'
import ListItem from '../../../modules/common/components/ListItem'

type PropsType = {|
  job: SprungbrettJobModel
|}

class SprungbrettListItem extends React.PureComponent<PropsType> {
  render() {
    const { job } = this.props
    return (
      <ListItem title={job.title} path={job.url} isExternalUrl>
        <div>{job.location}</div>
      </ListItem>
    )
  }
}

export default SprungbrettListItem
