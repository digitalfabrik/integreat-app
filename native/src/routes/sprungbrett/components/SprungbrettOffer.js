// @flow

import * as React from 'react'

import { Linking } from 'react-native'
import { SprungbrettJobModel, OfferModel } from 'api-client'
import SprungbrettListItem from './SprungbrettListItem'
import type { TFunction } from 'react-i18next'
import type { ThemeType } from '../../../modules/theme/constants'
import List from '../../../modules/common/components/List'
import Caption from '../../../modules/common/components/Caption'

type PropsType = {|
  sprungbrettJobs: Array<SprungbrettJobModel>,
  t: TFunction,
  theme: ThemeType,
  language: string,
  sprungbrettOffer: OfferModel
|}

class SprungbrettOffer extends React.Component<PropsType> {
  openJobInBrowser = (url: string) => () => {
    Linking.openURL(url)
  }

  renderSprungbrettListItem = (job: SprungbrettJobModel): React.Node => (
    <SprungbrettListItem key={job.id} job={job} openJobInBrowser={this.openJobInBrowser(job.url)}
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
