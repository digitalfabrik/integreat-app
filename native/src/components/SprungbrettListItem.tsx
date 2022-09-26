import React, { PureComponent, ReactElement } from 'react'
import { Text } from 'react-native'

import { SprungbrettJobModel } from 'api-client'

import ListItem from './ListItem'

type Props = {
  job: SprungbrettJobModel
  openJobInBrowser: () => void
  language: string
}

// This should stay a PureComponent for performance reasons
class SprungbrettListItem extends PureComponent<Props> {
  render(): ReactElement {
    const { language, job, openJobInBrowser } = this.props
    return (
      <ListItem thumbnail={null} title={job.title} navigateTo={openJobInBrowser} language={language}>
        <Text>{job.location}</Text>
      </ListItem>
    )
  }
}

export default SprungbrettListItem
