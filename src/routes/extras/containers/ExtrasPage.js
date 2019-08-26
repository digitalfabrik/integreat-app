// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import TileModel from '../../../modules/common/models/TileModel'
import Tiles from '../../../modules/common/components/Tiles'
import { ExtraModel } from '@integreat-app/integreat-api-client'
import type { TFunction } from 'react-i18next'
import { withTranslation } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import { compose } from 'recompose'
import SprungbrettRouteConfig, { SPRUNGBRETT_EXTRA } from '../../../modules/app/route-configs/SprungbrettRouteConfig'
import WohnenRouteConfig, { WOHNEN_EXTRA } from '../../../modules/app/route-configs/WohnenRouteConfig'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'

type PropsType = {|
  city: string,
  language: string,
  extras: Array<ExtraModel>,
  extraId: ?string,
  t: TFunction
|}

/**
 * Displays tiles with all available extras or the page for a selected extra
 */
export class ExtrasPage extends React.Component<PropsType> {
  toTileModels (extras: Array<ExtraModel>): Array<TileModel> {
    const { city, language } = this.props
    return extras.map(
      extra => {
        let path = extra.path
        if (extra.alias === SPRUNGBRETT_EXTRA) {
          path = new SprungbrettRouteConfig().getRoutePath({ city, language })
        } else if (extra.alias === WOHNEN_EXTRA) {
          path = new WohnenRouteConfig().getRoutePath({ city, language })
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
      const error = new ContentNotFoundError({ type: 'extra', id: extraId, city: city, language })
      return <FailureSwitcher error={error} />
    }

    return (
      <Tiles title={t('extras')} tiles={this.toTileModels(extras)} />
    )
  }
}

const mapStateToProps = (state: StateType) => ({
  city: state.location.payload.city,
  language: state.location.payload.language,
  extraId: state.location.payload.extraId
})

export default compose(
  connect(mapStateToProps),
  withTranslation('extras')
)(ExtrasPage)
