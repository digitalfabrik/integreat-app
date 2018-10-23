// @flow

import * as React from 'react'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'

import ListItem from '../../../modules/common/components/ListItem'
import Caption from '../../../modules/common/components/Caption'

import List from '../../../modules/common/components/List'
import PoiModel from '../../../modules/endpoint/models/PoiModel'

type PropsType = {|
  pois: Array<PoiModel>,
  t: TFunction
|}

/**
 * Display a list of pois
 */
class PoiList extends React.Component<PropsType> {
  renderListItems (): Array<React.Node> {
    const {pois} = this.props
    return pois.map(poi =>
      <ListItem key={poi.path}
                thumbnail={poi.thumbnail}
                title={poi.title}
                path={poi.path}>
        <div>{poi.location.location}</div>
      </ListItem>
    )
  }

  render () {
    const t = this.props.t
    return (
      <>
        <Caption title={t('pois')} />
        <List noItemsMessage={t('noPois')}>
          {this.renderListItems()}
        </List>
      </>
    )
  }
}

export default translate('pois')(PoiList)
