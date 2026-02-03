import { DateTime } from 'luxon'
import segment from 'sentencex'

import CategoryModel from '../api/models/CategoryModel'
import { APPOINTMENT_BOOKING_OFFER_ALIAS, INTERNAL_OFFERS } from '../constants'
import TileModel from '../models/TileModel'

export const getSlugFromPath = (path: string): string => path.split('/').pop() ?? ''

export const formatDateICal = (date: DateTime): string =>
  // DateTime.toFormat() does not respect the locale settings on some devices
  // Therefore hackily convert an ISO date to ICal format
  // https://github.com/digitalfabrik/integreat-app/pull/3158#pullrequestreview-2935063754
  date.toISO().replace(/-/g, '').replace(/:/g, '').replace(/\..*/, '')

export const safeParseInt = (value: string | number | undefined | null): number | undefined => {
  if (value === null || value === undefined || value === '') {
    return undefined
  }
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) ? parsed : undefined
}

export const addSubdomain = ({ url, subdomain }: { url: string; subdomain: string }): string => {
  if (subdomain === '') {
    return url
  }
  const newUrl = new URL(url)
  newUrl.hostname = `${subdomain}.${newUrl.hostname}`
  return newUrl.toString()
}

export const getCategoryTiles = ({
  categories,
  cityCode,
}: {
  categories: CategoryModel[]
  cityCode: string
}): TileModel[] =>
  categories.map(category => {
    const externalOffer = category.embeddedOffers.find(it => !INTERNAL_OFFERS.includes(it.alias))
    const externalOfferUrl =
      externalOffer?.alias === APPOINTMENT_BOOKING_OFFER_ALIAS
        ? addSubdomain({ url: externalOffer.path, subdomain: cityCode })
        : externalOffer?.path
    return new TileModel({
      title: category.title,
      path: externalOfferUrl ?? category.path,
      thumbnail: category.thumbnail,
      isExternalUrl: externalOfferUrl !== undefined,
    })
  })

export const hasProp = <P extends PropertyKey, O extends { [p in P]: unknown }>(
  object: O,
  property: P,
): object is O & { [p in P]: NonNullable<unknown> } => object[property] !== undefined && object[property] !== null

type SegmentOptions = {
  languageCode: string
}

export const segmentText = (content: string, { languageCode }: SegmentOptions): string[] =>
  segment(languageCode, content)
    .map(segment => segment.split('\n'))
    .flat()
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 0)

export const getGenericLanguageCode = (languageCode: string): string => {
  const genericLanguageCode = languageCode.split('-')[0]
  if (!genericLanguageCode) {
    throw new Error('Invalid language code!')
  }
  return genericLanguageCode
}

export const join = <T, U>(items: T[], separator: (index: number) => U): (T | U)[] =>
  items.flatMap((item, index) => [item, separator(index)]).slice(0, -1)
