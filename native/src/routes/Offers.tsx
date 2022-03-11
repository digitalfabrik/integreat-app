import React, { ReactElement } from 'react'
import { TFunction } from 'react-i18next'
import { View } from 'react-native'

import { OfferModel, SHELTER_ROUTE, SPRUNGBRETT_OFFER_ROUTE } from 'api-client'

import SiteHelpfulBox from '../components/SiteHelpfulBox'
import SpaceBetween from '../components/SpaceBetween'
import Tiles from '../components/Tiles'
import TileModel from '../models/TileModel'
import urlFromRouteInformation from '../navigation/url'

type PropsType = {
  offers: Array<OfferModel>
  navigateToFeedback: (isPositiveFeedback: boolean) => void
  navigateToOffer: (tile: TileModel) => void
  t: TFunction
  languageCode: string
  cityCode: string
}

const Offers = ({
  offers,
  navigateToFeedback,
  navigateToOffer,
  t,
  languageCode,
  cityCode
}: PropsType): ReactElement => (
  <SpaceBetween>
    <View>
      <Tiles
        title={t('offers')}
        tiles={offers.map(offer => {
          let path = offer.path
          if (offer.alias === SPRUNGBRETT_OFFER_ROUTE) {
            path = offer.alias
          } else if (offer.alias === SHELTER_ROUTE) {
            path = urlFromRouteInformation({ route: SHELTER_ROUTE, cityCode, languageCode })
          }
          return new TileModel({
            title: t(offer.title),
            path,
            thumbnail: offer.thumbnail,
            isExternalUrl: offer.alias !== SPRUNGBRETT_OFFER_ROUTE,
            postData: offer.postData
          })
        })}
        onTilePress={navigateToOffer}
        language={languageCode}
      />
    </View>
    <SiteHelpfulBox navigateToFeedback={navigateToFeedback} />
  </SpaceBetween>
)

export default Offers
