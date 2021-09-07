import * as React from 'react'
import { ReactNode } from 'react'
import { Text } from 'react-native'

import { SprungbrettJobModel } from 'api-client'
import { ThemeType } from 'build-configs'

import ListItem from './ListItem'

type PropsType = {
  job: SprungbrettJobModel
  openJobInBrowser: () => void
  theme: ThemeType
  language: string
}

class SprungbrettListItem extends React.PureComponent<PropsType> {
  render(): ReactNode {
    const { language, job, openJobInBrowser, theme } = this.props
    return (
      <ListItem thumbnail={null} title={job.title} navigateTo={openJobInBrowser} theme={theme} language={language}>
        <Text>{job.location}</Text>
      </ListItem>
    )
  }
}

export default SprungbrettListItem
