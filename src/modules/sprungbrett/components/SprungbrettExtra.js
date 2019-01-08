// @flow

import * as React from 'react'

import { Linking } from 'react-native'
import { SprungbrettJobModel, ExtraModel } from '@integreat-app/integreat-api-client'
import SprungbrettListItem from './SprungbrettListItem'
import type { TFunction } from 'react-i18next'
import List from '../../common/components/List'
import Caption from '../../common/components/Caption'
import { SPRUNGBRETT_EXTRA } from '../../extras/hashWohnenOffer'
import Failure from '../../error/components/Failure'

type PropsType = {|
  sprungbrettJobs: Array<SprungbrettJobModel>,
  extras: Array<ExtraModel>,
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
    const {sprungbrettJobs, extras, t} = this.props
    const extra: ExtraModel | void = extras.find(extra => extra.alias === SPRUNGBRETT_EXTRA)

    if (!extra) {
      return <Failure error={new Error('The Sprungbrett extra is not supported.')} />
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
