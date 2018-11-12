// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import TileModel from '../../../modules/common/models/TileModel'
import Tiles from '../../../modules/common/components/Tiles'
import ExtraModel from '../../../modules/endpoint/models/ExtraModel'
import type { TFunction } from 'react-i18next'
import { translate } from 'react-i18next'
import CityModel from '../../../modules/endpoint/models/CityModel'
import type { StateType } from '../../../modules/app/StateType'
import Helmet from '../../../modules/common/containers/Helmet'
import { compose } from 'recompose'
import sprungbrettRoute, { SPRUNGBRETT_EXTRA } from '../../../modules/app/routes/sprungbrett'
import wohnenRoute, { WOHNEN_EXTRA } from '../../../modules/app/routes/wohnen'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import ContentNotFoundError from '../../../modules/common/errors/ContentNotFoundError'

type PropsType = {|
  city: string,
  language: string,
  extras: ?Array<ExtraModel>,
  cities: ?Array<CityModel>,
  extraId: ?string,
  t: TFunction
|}

/**
 * Displays tiles with all available extras or the page for a selected extra
 */
export class ExtrasPage extends React.Component<PropsType> {
  toTileModels (extras: Array<ExtraModel>): Array<TileModel> {
    const {city, language} = this.props
    return extras.map(
      extra => {
        let path = extra.path
        if (extra.alias === SPRUNGBRETT_EXTRA) {
          path = sprungbrettRoute.getRoutePath({city, language})
        } else if (extra.alias === WOHNEN_EXTRA) {
          path = wohnenRoute.getRoutePath({city, language})
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
    const {city, cities, extras, extraId, language, t} = this.props

    if (!cities || !extras) {
      throw new Error('Data not ready')
    }

    const cityName = CityModel.findCityName(cities, city)

    if (extraId) {
      // If there is an extraId, the route is invalid, because every internal extra has a separate route
      const error = new ContentNotFoundError({type: 'extra', id: extraId, city: city, language})
      return <FailureSwitcher error={error} />
    }

    return (
      <>
        <Helmet title={`${t('pageTitle')} - ${cityName}`} />
        <Tiles title={t('extras')} tiles={this.toTileModels(extras)} />
      </>
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
  translate('extras')
)(ExtrasPage)
