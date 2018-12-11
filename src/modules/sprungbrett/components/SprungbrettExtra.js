// @flow

import * as React from 'react'

import { Linking } from 'react-native'
import { SprungbrettJobModel, ExtraModel } from '@integreat-app/integreat-api-client'
import SprungbrettListItem from './SprungbrettListItem'
import FailureSwitcher from '../../common/components/FailureSwitcher'
import type { TFunction } from 'react-i18next'
import List from '../../common/components/List'
import Caption from '../../common/components/Caption'

type PropsType = {|
  sprungbrettJobs: Array<SprungbrettJobModel>,
  extras: Array<ExtraModel>,
  t: TFunction
|}

class SprungbrettExtra extends React.Component<PropsType> {
  openJobInBrowser = (url: string) => function () {
    Linking.openURL(url)
  }

  renderSprungbrettListItem = (job: SprungbrettJobModel): React.Node => (
    <SprungbrettListItem key={job.id} job={job} openJobInBrowser={this.openJobInBrowser(job.url)} />
  )

  render () {
    const {sprungbrettJobs, extras, t} = this.props
    const extra: ExtraModel | void = extras.find(extra => extra.alias === 'sprungbrett')

    if (!extra) {
      return <FailureSwitcher error={new Error('The Sprunbrett extra is not supported.')} />
    }

    return (
      <>
        <Caption title={extra.title} />
        <List noItemsMessage={t('noOffersAvailable')}
              renderItem={this.renderSprungbrettListItem}
              items={sprungbrettJobs} />
      </>
    )
  }
}

export default SprungbrettExtra
