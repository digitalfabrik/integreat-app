import React from 'react'
import TileModel from '../models/TileModel'
import Tiles from '../components/Tiles'
import { TFunction } from 'react-i18next'
import { View } from 'react-native'
import { ThemeType } from 'build-configs'
import SpaceBetween from '../components/SpaceBetween'
import SiteHelpfulBox from '../components/SiteHelpfulBox'
import { SPRUNGBRETT_OFFER_ROUTE, OfferModel } from 'api-client'

type PropsType = {
  offers: Array<OfferModel>
  navigateToFeedback: (isPositiveFeedback: boolean) => void
  navigateToOffer: (tile: TileModel) => void
  theme: ThemeType
  t: TFunction
  language: string
}

const toTileModels = (offer: Array<OfferModel>): Array<TileModel> => {
  return offer.map(offer => {
    const isInternalExtra = [SPRUNGBRETT_OFFER_ROUTE as string].includes(offer.alias)
    const path = isInternalExtra ? offer.alias : offer.path
    return new TileModel({
      title: offer.title,
      path: path,
      thumbnail: offer.thumbnail,
      isExternalUrl: !isInternalExtra,
      postData: offer.postData
    })
  })
}

const Offers = ({ offers, navigateToFeedback, navigateToOffer, theme, t, language }: PropsType) => {
  return (
    <SpaceBetween>
      <View>
        <Tiles
          title={t('offers')}
          tiles={toTileModels(offers)}
          onTilePress={navigateToOffer}
          theme={theme}
          language={language}
        />
      </View>
      <SiteHelpfulBox navigateToFeedback={navigateToFeedback} theme={theme} />
    </SpaceBetween>
  )
}

export default Offers
