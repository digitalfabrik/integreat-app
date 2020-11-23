// @flow

import * as React from 'react'
import TileModel from '../../../modules/common/models/TileModel'
import {
  CityModel,
  OfferModel
} from 'api-client'
import Tiles from '../../../modules/common/components/Tiles'
import type { TFunction } from 'react-i18next'
import { SPRUNGBRETT_OFFER, SPRUNGBRETT_ROUTE, WOHNEN_OFFER, WOHNEN_ROUTE } from '../constants'
import { View } from 'react-native'
import type { ThemeType } from '../../../modules/theme/constants'
import type { NavigationStackProp } from 'react-navigation-stack'
import SpaceBetween from '../../../modules/common/components/SpaceBetween'
import SiteHelpfulBox from '../../../modules/common/components/SiteHelpfulBox'
import type { FeedbackInformationType } from '../../feedback/containers/FeedbackModalContainer'

type PropsType = {|
  offers: Array<OfferModel>,
  navigateToOffer: (path: string, isExternalUrl: boolean, postData: ?Map<string, string>) => void,
  navigation: NavigationStackProp<*>,
  theme: ThemeType,
  cities: Array<CityModel>,
  t: TFunction,
  cityCode: string,
  language: string
|}

class Offers extends React.Component<PropsType> {
  onTilePress = (tile: TileModel) => {
    this.props.navigateToOffer(tile.path, tile.isExternalUrl, tile.postData)
  }

  toTileModels (offer: Array<OfferModel>): Array<TileModel> {
    return offer.map(
      offer => {
        let path = offer.path
        if (offer.alias === SPRUNGBRETT_OFFER) {
          path = SPRUNGBRETT_ROUTE
        } else if (offer.alias === WOHNEN_OFFER) {
          path = WOHNEN_ROUTE
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
    const { navigation, offers, cities, cityCode, language } = this.props
    if (!cityCode || !language) {
      throw Error('language or cityCode not available')
    }

    const cityTitle = CityModel.findCityName(cities, cityCode)

    const feedbackInformation: FeedbackInformationType = {
      type: 'Offers',
      language,
      cityTitle: cityTitle,
      offers,
      isPositiveFeedback
    }

    navigation.navigate('FeedbackModal', { ...feedbackInformation })
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
