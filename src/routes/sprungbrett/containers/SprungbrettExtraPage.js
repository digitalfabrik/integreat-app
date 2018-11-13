// @flow

import * as React from 'react'

import SprungbrettJobModel from '../../../modules/endpoint/models/SprungbrettJobModel'
import SprungbrettListItem from '../components/SprungbrettListItem'
import ExtraModel from '../../../modules/endpoint/models/ExtraModel'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import { translate } from 'react-i18next'
import type { TFunction } from 'react-i18next'
import List from '../../../modules/common/components/List'

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
        <List noItemsMessage={t('noOffersAvailable')}
              renderItem={this.renderSprungbrettListItem}
              items={sprungbrettJobs} />
    )
  }
}

export default translate('sprungbrett')(SprungbrettExtraPage)
