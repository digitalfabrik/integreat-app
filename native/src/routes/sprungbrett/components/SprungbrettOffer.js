// @flow

import * as React from 'react'
import { SprungbrettJobModel, OfferModel } from 'api-client'
import SprungbrettListItem from './SprungbrettListItem'
import type { TFunction } from 'react-i18next'
import type { ThemeType } from 'build-configs/ThemeType'
import List from '../../../modules/common/components/List'
import Caption from '../../../modules/common/components/Caption'
import openExternalUrl from '../../../modules/common/openExternalUrl'

type PropsType = {|
  sprungbrettJobs: Array<SprungbrettJobModel>,
  t: TFunction,
  theme: ThemeType,
  language: string,
  sprungbrettOffer: OfferModel
|}

class SprungbrettOffer extends React.Component<PropsType> {
  openJob = (url: string) => () => {
    openExternalUrl(url)
  }

  renderSprungbrettListItem = (job: SprungbrettJobModel): React.Node => (
    <SprungbrettListItem key={job.id} job={job} openJobInBrowser={this.openJob(job.url)}
                         theme={this.props.theme} language={this.props.language} />
  )

  render () {
    const { sprungbrettOffer, sprungbrettJobs, t, theme } = this.props

    return <>
        <Caption title={sprungbrettOffer.title} theme={theme} />
        <List noItemsMessage={t('noOffersAvailable')}
              renderItem={this.renderSprungbrettListItem}
              items={sprungbrettJobs}
              theme={theme} />
    </>
  }
}

export default SprungbrettOffer
