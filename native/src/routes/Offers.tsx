import React, { ReactElement } from 'react'
import { TFunction } from 'react-i18next'
import { View } from 'react-native'

import { SPRUNGBRETT_OFFER_ROUTE, OfferModel } from 'api-client'
import { ThemeType } from 'build-configs'

import SiteHelpfulBox from '../components/SiteHelpfulBox'
import SpaceBetween from '../components/SpaceBetween'
import Tiles from '../components/Tiles'
import TileModel from '../models/TileModel'

type PropsType = {
  offers: Array<OfferModel>
  navigateToFeedback: (isPositiveFeedback: boolean) => void
  navigateToOffer: (tile: TileModel) => void
  theme: ThemeType
  t: TFunction
  language: string
}

const toTileModels = (offer: Array<OfferModel>): Array<TileModel> =>
  offer.map(offer => {
    const isInternalExtra = [SPRUNGBRETT_OFFER_ROUTE as string].includes(offer.alias)
    const path = isInternalExtra ? offer.alias : offer.path
    return new TileModel({
      title: offer.title,
      path,
      thumbnail: offer.thumbnail,
      isExternalUrl: !isInternalExtra,
      postData: offer.postData
    })
  })

const Offers = ({ offers, navigateToFeedback, navigateToOffer, theme, t, language }: PropsType): ReactElement => (
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
    <SiteHelpfulBox navigateToFeedback={navigateToFeedback} />
  </SpaceBetween>
)

export default Offers
