import React, { ReactElement } from 'react'
import { Text } from 'react-native'

import { SprungbrettJobModel } from 'shared/api'

import { SprungbrettIcon } from '../assets'
import ListItem from './ListItem'

type SprungbrettListItemProps = {
  job: SprungbrettJobModel
  openJobInBrowser: () => void
  language: string
}

const SprungbrettListItem = ({ language, job, openJobInBrowser }: SprungbrettListItemProps): ReactElement => (
  <ListItem thumbnail={SprungbrettIcon} title={job.title} navigateTo={openJobInBrowser} language={language}>
    <Text>{job.location}</Text>
  </ListItem>
)

export default SprungbrettListItem
