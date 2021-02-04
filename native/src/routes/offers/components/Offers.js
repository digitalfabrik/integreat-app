// @flow

import React, { useCallback } from 'react'
import TileModel from '../../../modules/common/models/TileModel'
import { OfferModel } from 'api-client'
import Tiles from '../../../modules/common/components/Tiles'
import type { TFunction } from 'react-i18next'
import { View } from 'react-native'
import type { ThemeType } from 'build-configs/ThemeType'
import SpaceBetween from '../../../modules/common/components/SpaceBetween'
import SiteHelpfulBox from '../../../modules/common/components/SiteHelpfulBox'
import { SPRUNGBRETT_OFFER_ROUTE, WOHNEN_OFFER_ROUTE } from 'api-client/src/routes'

type PropsType = {|
  offers: Array<OfferModel>,
  navigateToFeedback: (isPositiveFeedback: boolean) => void,
  navigateToOffer: (
    offers: Array<OfferModel>,
    path: string,
    isExternalUrl: boolean,
    postData: ?Map<string, string>
  ) => void,
  theme: ThemeType,
  t: TFunction,
  cityCode: string,
  language: string
|}

const toTileModels = (offer: Array<OfferModel>): Array<TileModel> => {
  return offer.map(
    offer => {
      const path = [SPRUNGBRETT_OFFER_ROUTE, WOHNEN_OFFER_ROUTE].includes(offer.alias)
        ? offer.alias
        : offer.path

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

const Offers = ({ offers, navigateToFeedback, navigateToOffer, theme, t, cityCode, language }: PropsType) => {
  const onTilePress = useCallback((tile: TileModel) => {
    const offer = offers.filter(offer => offer.alias === tile.path)
    navigateToOffer(offer, tile.path, tile.isExternalUrl, tile.postData)
  }, [navigateToOffer, offers])

  return (
    <SpaceBetween>
      <View>
        <Tiles title={t('offers')} tiles={toTileModels(offers)} onTilePress={onTilePress} theme={theme}
               language={language} />
      </View>
      <SiteHelpfulBox navigateToFeedback={navigateToFeedback} theme={theme} t={t} />
    </SpaceBetween>
  )
}

export default Offers
