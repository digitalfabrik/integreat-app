// @flow

import * as React from 'react'
import { Text } from 'react-native'
import { SprungbrettJobModel } from '@integreat-app/integreat-api-client'
import ListItem from '../../../modules/common/components/ListItem'
import type { ThemeType } from '../../../modules/theme/constants/theme'

type PropsType = {|
  job: SprungbrettJobModel,
  openJobInBrowser: () => void,
  theme: ThemeType
|}

class SprungbrettListItem extends React.PureComponent<PropsType> {
  render () {
    const { job, openJobInBrowser, theme } = this.props
    return (
      <ListItem thumbnail={null} title={job.title} navigateTo={openJobInBrowser} theme={theme}>
        <Text>{job.location}</Text>
      </ListItem>
    )
  }
}

export default SprungbrettListItem
