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
  renderListItems (): Array<React.Node> {
    return this.props.jobs.map(job => (
      <ListItem key={job.id} title={job.title} path={job.url} isExternalUrl>
        <div>{job.location}</div>
      </ListItem>
    ))
  }

  render () {
    const {title, t} = this.props
    return (
      <>
        <Caption title={title} />
        <List noItemsMessage={t('noOffersAvailable')}>
          {this.renderListItems()}
        </List>
      </>
    )
  }
}

export default translate('sprungbrett')(SprungbrettList)
