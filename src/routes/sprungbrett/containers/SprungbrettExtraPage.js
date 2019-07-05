// @flow

import * as React from 'react'

import { SprungbrettJobModel, ExtraModel } from '@integreat-app/integreat-api-client'
import SprungbrettListItem from '../components/SprungbrettListItem'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import List from '../../../modules/common/components/List'
import Caption from '../../../modules/common/components/Caption'

type PropsType = {|
  sprungbrettJobs: Array<SprungbrettJobModel>,
  extras: Array<ExtraModel>,
  t: TFunction
|}

export class SprungbrettExtraPage extends React.Component<PropsType> {
  renderSprungbrettListItem = (job: SprungbrettJobModel): React.Node => <SprungbrettListItem key={job.id} job={job} />

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

export default withTranslation('sprungbrett')(SprungbrettExtraPage)
