import React, { PureComponent, ReactElement } from 'react'
import { Text } from 'react-native'

import { SprungbrettJobModel } from 'shared/api'

import { SprungbrettIcon } from '../assets'
import ListItem from './ListItem'
import Icon from './base/Icon'

type SprungbrettListItemProps = {
  job: SprungbrettJobModel
  openJobInBrowser: () => void
  language: string
}

// This should stay a PureComponent for performance reasons
class SprungbrettListItem extends PureComponent<SprungbrettListItemProps> {
  render(): ReactElement {
    const { language, job, openJobInBrowser } = this.props
    return (
      <ListItem
        thumbnail={<Icon Icon={SprungbrettIcon} />}
        title={job.title}
        navigateTo={openJobInBrowser}
        language={language}>
        <Text>{job.location}</Text>
      </ListItem>
    )
  }
}

export default SprungbrettListItem
