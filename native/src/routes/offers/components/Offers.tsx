import React from 'react'
import TileModel from '../../../modules/common/models/TileModel'
import { OfferModel } from 'api-client'
import Tiles from '../../../modules/common/components/Tiles'
import type { TFunction } from 'react-i18next'
import { View } from 'react-native'
import type { ThemeType } from 'build-configs/ThemeType'
import SpaceBetween from '../../../modules/common/components/SpaceBetween'
import SiteHelpfulBox from '../../../modules/common/components/SiteHelpfulBox'
import { SPRUNGBRETT_OFFER_ROUTE } from 'api-client/src/routes'
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
    const isInternalExtra = [SPRUNGBRETT_OFFER_ROUTE].includes(offer.alias)
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
