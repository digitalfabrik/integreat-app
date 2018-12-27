// @flow

import * as React from 'react'
import TileModel from '../../common/models/TileModel'
import { ExtraModel } from '@integreat-app/integreat-api-client'
import Tiles from '../../common/components/Tiles'
import type { TFunction } from 'react-i18next'
import {
  SPRUNGBRETT_EXTRA,
  SPRUNGBRETT_ROUTE,
  WOHNEN_EXTRA, WOHNEN_ROUTE
} from '../ExtrasConfig'
import { ScrollView } from 'react-native'

type PropsType = {|
  extras: Array<ExtraModel>,
  navigateToExtras: (path: string, isExternalUrl: boolean) => void,
  t: TFunction
|}

export default class Extras extends React.Component<PropsType> {
  onTilePress = (tile: TileModel) => {
    console.log('Tile pressed')
    this.props.navigateToExtras(tile.path, tile.isExternalUrl)
  }

  toTileModels (extras: Array<ExtraModel>): Array<TileModel> {
    return extras.map(
      extra => {
        let route = extra.path
        if (extra.alias === SPRUNGBRETT_EXTRA) {
          route = SPRUNGBRETT_ROUTE
        } else if (extra.alias === WOHNEN_EXTRA) {
          route = WOHNEN_ROUTE
        }

        return new TileModel({
          id: extra.alias,
          title: extra.title,
          path: route,
          thumbnail: extra.thumbnail,
          // every extra except the sprungbrett extra is just a link to an external site
          isExternalUrl: false,
          postData: extra.postData
        })
      }
    )
  }

  render () {
    const {extras, t} = this.props
    return (
      <ScrollView>
      <Tiles title={t('extras')} tiles={this.toTileModels(extras)} onTilePress={this.onTilePress} />
      </ScrollView>
    )
  }
}
