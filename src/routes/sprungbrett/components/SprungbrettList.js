// @flow

import * as React from 'react'

import SprungbrettJobModel from '../../../modules/endpoint/models/SprungbrettJobModel'

import Caption from '../../../modules/common/components/Caption'
import ListItem from '../../../modules/common/components/ListItem'
import List from '../../../modules/common/components/List'
import { translate } from 'react-i18next'
import type { TFunction } from 'react-i18next'

type PropsType = {|
  jobs: Array<SprungbrettJobModel>,
  title: string,
  t: TFunction
|}

export class SprungbrettList extends React.Component<PropsType> {
  renderSprungbrettJob (job: SprungbrettJobModel): React.Node {
    return (
      <ListItem key={job.id} title={job.title} path={job.url} isExternalUrl>
        <div>{job.location}</div>
      </ListItem>
    )
  }

  render () {
    const {jobs, title, t} = this.props
    return (
      <>
        <Caption title={title} />
        <List noItemsMessage={t('noOffersAvailable')} items={jobs} renderItem={this.renderSprungbrettJob} />
      </>
    )
  }
}

export default translate('sprungbrett')(SprungbrettList)
