// @flow

import * as React from 'react'
import { Text } from 'react-native'
import { SprungbrettJobModel } from '@integreat-app/integreat-api-client'
import ListItem from '../../../modules/common/components/ListItem'

type PropsType = {|
  job: SprungbrettJobModel,
  openJobInBrowser: () => void
|}

class SprungbrettListItem extends React.PureComponent<PropsType> {
  render () {
    const { job, openJobInBrowser } = this.props
    return (
      <ListItem title={job.title} navigateTo={openJobInBrowser}>
        <Text>{job.location}</Text>
      </ListItem>
    )
  }
}

export default SprungbrettListItem
