import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { SPRUNGBRETT_OFFER_ROUTE, MALTE_HELP_FORM_OFFER_ROUTE } from 'shared'
import { OfferModel } from 'shared/api'

import Tiles from '../components/Tiles'
import TileModel from '../models/TileModel'

type OffersProps = {
  offers: Array<OfferModel>
  navigateToOffer: (tile: TileModel) => void
  languageCode: string
}

const internalOffers = [SPRUNGBRETT_OFFER_ROUTE, MALTE_HELP_FORM_OFFER_ROUTE] as string[]

const Offers = ({ offers, navigateToOffer, languageCode }: OffersProps): ReactElement => {
  const { t } = useTranslation('offers')

  const tiles = offers
    .filter(offer => offer.alias !== MALTE_HELP_FORM_OFFER_ROUTE)
    .map(offer => {
      let path = offer.path
      if (internalOffers.includes(offer.alias)) {
        path = offer.alias
      }
      return new TileModel({
        title: t(offer.title),
        path,
        thumbnail: offer.thumbnail,
        isExternalUrl: !internalOffers.includes(offer.alias),
        postData: offer.postData,
      })
    })

  return (
    <View>
      <Tiles
        title={t('offers')}
        tiles={tiles}
        onTilePress={navigateToOffer}
        language={languageCode}
        resourceCache={undefined}
      />
    </View>
  )
}

export default Offers
