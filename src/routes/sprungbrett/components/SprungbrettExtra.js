// @flow

import * as React from 'react'

import { Linking } from 'react-native'
import { SprungbrettJobModel, ExtraModel } from '@integreat-app/integreat-api-client'
import SprungbrettListItem from './SprungbrettListItem'
import type { TFunction } from 'react-i18next'
import List from '../../common/components/List'
import Caption from '../../common/components/Caption'
import Failure from '../../error/components/Failure'
import { SPRUNGBRETT_EXTRA } from '../../extras/constants'
import type { ThemeType } from '../../theme/constants/theme'
import List from '../../../modules/common/components/List'
import Caption from '../../../modules/common/components/Caption'

type PropsType = {|
  sprungbrettJobs: Array<SprungbrettJobModel>,
  t: TFunction,
  theme: ThemeType
  sprungbrettExtra: ExtraModel,
  t: TFunction
|}

class SprungbrettExtra extends React.Component<PropsType> {
  openJobInBrowser = (url: string) => () => {
    Linking.openURL(url)
  }

  renderSprungbrettListItem = (job: SprungbrettJobModel): React.Node => (
    <SprungbrettListItem key={job.id} job={job} openJobInBrowser={this.openJobInBrowser(job.url)} />
  )

  render () {
    const {sprungbrettExtra, sprungbrettJobs, t} = this.props

    return (
      <>
        <Caption title={sprungbrettExtra.title} theme={this.props.theme} />
        <List noItemsMessage={t('noOffersAvailable')}
              renderItem={this.renderSprungbrettListItem}
              items={sprungbrettJobs} />
      </>
    )
  }
}

export default SprungbrettExtra
