// @flow

import * as React from 'react'
import TileModel from '../../../modules/common/models/TileModel'
import {
  CityModel,
  OfferModel
} from 'api-client'
import Tiles from '../../../modules/common/components/Tiles'
import type { TFunction } from 'react-i18next'
import { View } from 'react-native'
import type { ThemeType } from 'build-configs/ThemeType'
import SpaceBetween from '../../../modules/common/components/SpaceBetween'
import SiteHelpfulBox from '../../../modules/common/components/SiteHelpfulBox'
import createNavigateToFeedbackModal from '../../../modules/app/createNavigateToFeedbackModal'
import type {
  NavigationPropType,
  OffersRouteType,
  RoutePropType
} from '../../../modules/app/constants/NavigationTypes'
import { SPRUNGBRETT_OFFER_ROUTE, WOHNEN_OFFER_ROUTE } from '../../../modules/app/constants/NavigationTypes'

type PropsType = {|
  offers: Array<OfferModel>,
  navigateToOffer: (
    offers: Array<OfferModel>,
    path: string,
    isExternalUrl: boolean,
    postData: ?Map<string, string>
  ) => void,
  route: RoutePropType<OffersRouteType>,
  navigation: NavigationPropType<OffersRouteType>,
  theme: ThemeType,
  cities: Array<CityModel>,
  t: TFunction,
  cityCode: string,
  language: string
|}

class Offers extends React.Component<PropsType> {
  onTilePress = (tile: TileModel) => {
    const { navigateToOffer, offers } = this.props
    navigateToOffer(offers, tile.path, tile.isExternalUrl, tile.postData)
  }

  toTileModels (offer: Array<OfferModel>): Array<TileModel> {
    return offer.map(
      offer => {
        let path = offer.path
        if (offer.alias === SPRUNGBRETT_OFFER_ROUTE) {
          path = SPRUNGBRETT_OFFER_ROUTE
        } else if (offer.alias === WOHNEN_OFFER_ROUTE) {
          path = WOHNEN_OFFER_ROUTE
        }

        return new TileModel({
          title: offer.title,
          path: path,
          thumbnail: offer.thumbnail,
          // every offer except the sprungbrett and the wohnen offer is just a link to an external site
          isExternalUrl: path === offer.path,
          postData: offer.postData
        })
      }
    )
  }

  navigateToFeedback = (isPositiveFeedback: boolean) => {
    const { navigation, offers, cityCode, language } = this.props

    createNavigateToFeedbackModal(navigation)({
      type: 'Offers',
      language,
      cityCode,
      offers,
      isPositiveFeedback
    })
  }

  render () {
    const { language, offers, t, theme } = this.props
    return (
      <SpaceBetween>
        <View>
          <Tiles title={t('offers')} tiles={this.toTileModels(offers)} onTilePress={this.onTilePress} theme={theme}
                 language={language} />
        </View>
        <SiteHelpfulBox navigateToFeedback={this.navigateToFeedback} theme={theme} t={t} />
      </SpaceBetween>
    )
  }
}

export default Offers
