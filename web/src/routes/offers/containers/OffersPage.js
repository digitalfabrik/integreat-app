// @flow

import * as React from 'react'
import { connect } from 'react-redux'
import TileModel from '../../../modules/common/models/TileModel'
import Tiles from '../../../modules/common/components/Tiles'
import { CityModel, NotFoundError, OfferModel, SPRUNGBRETT_OFFER, WOHNEN_OFFER } from 'api-client'
import { withTranslation, TFunction } from 'react-i18next'
import type { StateType } from '../../../modules/app/StateType'
import SprungbrettRouteConfig from '../../../modules/app/route-configs/SprungbrettRouteConfig'
import WohnenRouteConfig from '../../../modules/app/route-configs/WohnenRouteConfig'
import FailureSwitcher from '../../../modules/common/components/FailureSwitcher'
import Failure from '../../../modules/common/components/Failure'
import CategoriesRouteConfig from '../../../modules/app/route-configs/CategoriesRouteConfig'

type PropsType = {|
  city: string,
  language: string,
  offers: Array<OfferModel>,
  offerId: ?string,
  t: typeof TFunction,
  cities: Array<CityModel>
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
        if (offer.alias === SPRUNGBRETT_OFFER) {
          path = new SprungbrettRouteConfig().getRoutePath({ city, language })
        } else if (offer.alias === WOHNEN_OFFER) {
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
    const { city, offers, offerId, language, t, cities } = this.props

    const cityModel = cities.find(cityModel => cityModel.code === city)

    if (!cityModel || !cityModel.offersEnabled) {
      return <Failure errorMessage='notFound.category' goToMessage='goTo.categories'
                      goToPath={new CategoriesRouteConfig().getRoutePath({ city, language })} />
    }

    if (offerId) {
      // If there is an offerId, the route is invalid, because every internal offer has a separate route
      const error = new NotFoundError({ type: 'offer', id: offerId, city: city, language })
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

export default connect<*, *, *, *, *, *>(mapStateToProps)(
  withTranslation('offers')(
    OffersPage
  ))
