// @flow

import * as React from 'react'
import { connect } from 'react-redux'

import TileModel from '../../../modules/common/models/TileModel'
import Tiles from '../../../modules/common/components/Tiles'
import { OfferModel } from '@integreat-app/integreat-api-client'
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
  offers: Array<OfferModel>,
  offerId: ?string,
  t: TFunction
|}

/**
 * Displays tiles with all available offers or the page for a selected offer
 */
export class OffersPage extends React.Component<PropsType> {
  toTileModels (offers: Array<OfferModel>): Array<TileModel> {
    const { city, language } = this.props
    return offers.map(
      offer => {
        let path = offer.path
        if (offer.alias === SPRUNGBRETT_EXTRA) {
          path = new SprungbrettRouteConfig().getRoutePath({ city, language })
        } else if (offer.alias === WOHNEN_EXTRA) {
          path = new WohnenRouteConfig().getRoutePath({ city, language })
        }

        return new TileModel({
          title: offer.title,
          // the url stored in the sprungbrett offer is the url of the endpoint
          path: path,
          thumbnail: offer.thumbnail,
          // every offer except from the sprungbrett offer is just a link to an external site
          isExternalUrl: path === offer.path,
          postData: offer.postData
        })
      }
    )
  }

  render () {
    const { city, offers, offerId, language, t } = this.props

    if (offerId) {
      // If there is an offerId, the route is invalid, because every internal offer has a separate route
      const error = new ContentNotFoundError({ type: 'offer', id: offerId, city: city, language })
      return <FailureSwitcher error={error} />
    }

    return (
      <Tiles title={t('offers')} tiles={this.toTileModels(offers)} />
    )
  }
}

const mapStateToProps = (state: StateType) => ({
  city: state.location.payload.city,
  language: state.location.payload.language,
  offerId: state.location.payload.offerId
})

export default compose(
  connect<*, *, *, *, *, *>(mapStateToProps),
  withTranslation('extras')
)(OffersPage)
