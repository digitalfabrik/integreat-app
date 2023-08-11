import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { OfferModel, SHELTER_ROUTE, SPRUNGBRETT_OFFER_ROUTE } from 'api-client'

import Tiles from '../components/Tiles'
import TileModel from '../models/TileModel'
import urlFromRouteInformation from '../navigation/url'

type OffersProps = {
  offers: Array<OfferModel>
  navigateToOffer: (tile: TileModel) => void
  languageCode: string
  cityCode: string
}

const Offers = ({ offers, navigateToOffer, languageCode, cityCode }: OffersProps): ReactElement => {
  const { t } = useTranslation('offers')

  const tiles = offers.map(offer => {
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
      postData: offer.postData,
    })
  })

  return (
    <View>
      <Tiles title={t('offers')} tiles={tiles} onTilePress={navigateToOffer} language={languageCode} />
    </View>
  )
}

export default Offers
