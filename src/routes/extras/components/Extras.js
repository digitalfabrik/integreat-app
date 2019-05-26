// @flow

import * as React from 'react'
import TileModel from '../../../modules/common/models/TileModel'
import { ExtraModel } from '@integreat-app/integreat-api-client'
import Tiles from '../../../modules/common/components/Tiles'
import type { TFunction } from 'react-i18next'
import {
  SPRUNGBRETT_EXTRA,
  SPRUNGBRETT_ROUTE,
  WOHNEN_EXTRA, WOHNEN_ROUTE
} from '../constants'
import { ScrollView } from 'react-native'
import type { ThemeType } from '../../../modules/theme/constants/theme'

type PropsType = {|
  extras: Array<ExtraModel>,
  navigateToExtra: (path: string, isExternalUrl: boolean) => void,
  theme: ThemeType,
  t: TFunction
|}

export default class Extras extends React.Component<PropsType> {
  onTilePress = (tile: TileModel) => {
    this.props.navigateToExtra(tile.path, tile.isExternalUrl)
  }

  toTileModels (extras: Array<ExtraModel>): Array<TileModel> {
    return extras.map(
      extra => {
        let path = extra.path
        if (extra.alias === SPRUNGBRETT_EXTRA) {
          path = SPRUNGBRETT_ROUTE
        } else if (extra.alias === WOHNEN_EXTRA) {
          path = WOHNEN_ROUTE
        }

        return new TileModel({
          title: extra.title,
          path: path,
          thumbnail: extra.thumbnail,
          // every extra except the sprungbrett and the wohnen extra is just a link to an external site
          isExternalUrl: path === extra.path,
          postData: extra.postData
        })
      }
    )
  }

  render () {
    const {extras, t, theme} = this.props
    return (
      <ScrollView>
        <Tiles title={t('extras')} tiles={this.toTileModels(extras)} onTilePress={this.onTilePress} theme={theme} />
      </ScrollView>
    )
  }
}
