import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { OfferModel, SPRUNGBRETT_OFFER_ROUTE } from 'api-client'

import Tiles from '../components/Tiles'
import TileModel from '../models/TileModel'

type OffersProps = {
  offers: Array<OfferModel>
  navigateToOffer: (tile: TileModel) => void
  languageCode: string
}

const Offers = ({ offers, navigateToOffer, languageCode }: OffersProps): ReactElement => {
  const { t } = useTranslation('offers')

  const tiles = offers.map(offer => {
    let path = offer.path
    if (offer.alias === SPRUNGBRETT_OFFER_ROUTE) {
      path = offer.alias
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
