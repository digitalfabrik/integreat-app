// @flow

import * as React from 'react'

import { OfferModel, SprungbrettJobModel } from '@integreat-app/integreat-api-client'
import SprungbrettListItem from '../components/SprungbrettListItem'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import List from '../../../modules/common/components/List'
import Caption from '../../../modules/common/components/Caption'

type PropsType = {|
  sprungbrettJobs: Array<SprungbrettJobModel>,
  offers: Array<OfferModel>,
  t: TFunction
|}

export class SprungbrettOfferPage extends React.Component<PropsType> {
  renderSprungbrettListItem = (job: SprungbrettJobModel): React.Node => <SprungbrettListItem key={job.id} job={job} />

  render () {
    const { sprungbrettJobs, offers, t } = this.props
    const offer: OfferModel | void = offers.find(offer => offer.alias === 'sprungbrett')

    if (!offer) {
      return <FailureSwitcher error={new Error('The Sprunbrett offer is not supported.')} />
    }

    return (
      <>
        <Caption title={offer.title} />
        <List noItemsMessage={t('noOffersAvailable')}
              renderItem={this.renderSprungbrettListItem}
              items={sprungbrettJobs} />
        <a target='_blank' rel='noopener noreferrer' href='https://www.sprungbrett-intowork.de'>
          <img src={offer.thumbnail} />
        </a>
      </>
    )
  }
}

export default withTranslation('sprungbrett')(SprungbrettOfferPage)
