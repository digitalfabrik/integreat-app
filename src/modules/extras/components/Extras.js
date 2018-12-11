// @flow

import * as React from 'react'
import TileModel from '../../common/models/TileModel'
import { ExtraModel } from '@integreat-app/integreat-api-client'
import Tiles from '../../common/components/Tiles'
import type { TFunction } from 'react-i18next'
import { getSprungbrettRoutePath, getWohnenRoutePath, SPRUNGBRETT_EXTRA, WOHNEN_EXTRA } from '../ExtrasConfig'

type PropsType = {|
  city: string,
  language: string,
  extras: Array<ExtraModel>,
  extraId: ?string,
  navigateToExtras: (path: string) => void,
  t: TFunction
|}

export default class Extras extends React.Component<PropsType> {
  onTilePress = (tile: TileModel) => {
    this.props.navigateToExtras(tile.path)
  }

  toTileModels (extras: Array<ExtraModel>): Array<TileModel> {
    const {city, language} = this.props
    return extras.map(
      extra => {
        let path = extra.path
        if (extra.alias === SPRUNGBRETT_EXTRA) {
          path = getSprungbrettRoutePath({city, language})
        } else if (extra.alias === WOHNEN_EXTRA) {
          path = getWohnenRoutePath({city, language})
        }

        return new TileModel({
          id: extra.alias,
          title: extra.title,
          // the url stored in the sprungbrett extra is the url of the endpoint
          path: path,
          thumbnail: extra.thumbnail,
          // every extra except from the sprungbrett extra is just a link to an external site
          isExternalUrl: path === extra.path,
          postData: extra.postData
        })
      }
    )
  }

  render () {
    const {extras, t} = this.props
    return (
      <Tiles title={t('extras')} tiles={this.toTileModels(extras)} onTilePress={this.onTilePress} />
    )
  }
}
