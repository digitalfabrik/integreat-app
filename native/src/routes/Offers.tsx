import React, { ReactElement } from 'react'
import { TFunction } from 'react-i18next'
import { View } from 'react-native'

import { OfferModel, SPRUNGBRETT_OFFER_ROUTE } from 'api-client'

import SiteHelpfulBox from '../components/SiteHelpfulBox'
import SpaceBetween from '../components/SpaceBetween'
import Tiles from '../components/Tiles'
import TileModel from '../models/TileModel'

type PropsType = {
  offers: Array<OfferModel>
  navigateToFeedback: (isPositiveFeedback: boolean) => void
  navigateToOffer: (tile: TileModel) => void
  t: TFunction
  language: string
}

const Offers = ({ offers, navigateToFeedback, navigateToOffer, t, language }: PropsType): ReactElement => (
  <SpaceBetween>
    <View>
      <Tiles
        title={t('offers')}
        tiles={offers.map(offer => {
          const isInternalExtra = [SPRUNGBRETT_OFFER_ROUTE as string].includes(offer.alias)
          const path = isInternalExtra ? offer.alias : offer.path
          return new TileModel({
            title: t(offer.title),
            path,
            thumbnail: offer.thumbnail,
            isExternalUrl: !isInternalExtra,
            postData: offer.postData
          })
        })}
        onTilePress={navigateToOffer}
        language={language}
      />
    </View>
    <SiteHelpfulBox navigateToFeedback={navigateToFeedback} />
  </SpaceBetween>
)

export default Offers
