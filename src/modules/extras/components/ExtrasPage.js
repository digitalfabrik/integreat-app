// @flow

import * as React from 'react'
import TileModel from '../../common/models/TileModel'
import { ExtraModel } from '@integreat-app/integreat-api-client'
import ContentNotFoundError from '../../common/errors/ContentNotFoundError'
import FailureSwitcher from '../../common/components/FailureSwitcher'
import Tiles from '../../common/components/Tiles'
import type { TFunction } from 'react-i18next'

type RouteParamsType = {|city: string, language: string, offerHash?: string|}
type SprungbrettRouteParamsType = {|city: string, language: string|}
type PropsType = {|
  city: string,
  language: string,
  extras: Array<ExtraModel>,
  extraId: ?string,
  navigateToCategories: (path: string) => void,
  t: TFunction
|}

export const SPRUNGBRETT_ROUTE = 'SPRUNGBRETT'
export const SPRUNGBRETT_EXTRA = 'sprungbrett'

export const WOHNEN_ROUTE = 'WOHNEN'
export const WOHNEN_EXTRA = 'wohnen'

const getWohnenRoutePath = ({city, language, offerHash}: RouteParamsType): string =>
  `/${city}/${language}/extras/${WOHNEN_EXTRA}${offerHash ? `/${offerHash}` : ''}`
const getSprungbrettRoutePath = ({city, language}: SprungbrettRouteParamsType): string =>
  `/${city}/${language}/extras/${SPRUNGBRETT_EXTRA}`

export class ExtrasPage extends React.Component<PropsType> {
  onTilePress = (tile: TileModel) => {
    this.props.navigateToCategories(tile.path)
  }

  toTileModels (extras: Array<ExtraModel>): Array<TileModel> {
    const { city, language } = this.props
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
    const { city, extras, extraId, language, t } = this.props

    if (extraId) {
      // If there is an extraId, the route is invalid, because every internal extra has a separate route
      const error = new ContentNotFoundError({type: 'extra', id: extraId, city: city, language})
      return <FailureSwitcher error={error} />
    }

    return (
      <Tiles title={t('extras')} tiles={this.toTileModels(extras)} onTilePress={this.onTilePress} />
    )
  }
}