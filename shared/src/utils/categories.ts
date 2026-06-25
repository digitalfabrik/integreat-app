import CategoryModel from '../api/models/CategoryModel.ts'
import { APPOINTMENT_BOOKING_OFFER_ALIAS, INTERNAL_OFFERS } from '../constants/index.ts'
import TileModel from '../models/TileModel.ts'
import { addSubdomain } from './index.ts'

export const getCategoryTiles = ({
  categories,
  regionCode,
}: {
  categories: CategoryModel[]
  regionCode: string
}): TileModel[] =>
  categories.map(category => {
    const externalOffer = category.embeddedOffers.find(it => !INTERNAL_OFFERS.includes(it.alias))
    const externalOfferUrl =
      externalOffer?.alias === APPOINTMENT_BOOKING_OFFER_ALIAS
        ? addSubdomain({ url: externalOffer.path, subdomain: regionCode })
        : externalOffer?.path
    return new TileModel({
      title: category.title,
      path: externalOfferUrl ?? category.path,
      thumbnail: category.thumbnail,
      isExternalUrl: externalOfferUrl !== undefined,
    })
  })
