import { BBox } from 'geojson'

/* eslint-disable camelcase */
export type JsonAvailableLanguagesType = Record<
  string,
  {
    id: number
    url: string
    path: string
  }
>
export type JsonLocationType = {
  id: number
  name: string
  address: string | null | undefined
  town: string | null | undefined
  state: string | null | undefined
  postcode: string | null | undefined
  region: string | null | undefined
  country: string
  latitude: string | null | undefined
  longitude: string | null | undefined
}
type JsonFeaturedImageInstanceType = {
  url: string
  width: number
  height: number
}
type JsonFeaturedImageType = {
  description: string
  mimetype: string
  thumbnail: Array<JsonFeaturedImageInstanceType>
  medium: Array<JsonFeaturedImageInstanceType>
  large: Array<JsonFeaturedImageInstanceType>
  full: Array<JsonFeaturedImageInstanceType>
}
type JsonEventInfoType = {
  id: number
  start_date: string
  end_date: string
  all_day: boolean
  start_time: string
  end_time: string
  recurrence_id: string | null | undefined
  timezone: string
}
export type JsonCategoryType = {
  id: number
  url: string
  path: string
  title: string
  modified_gmt: string
  excerpt: string
  content: string
  available_languages: JsonAvailableLanguagesType
  thumbnail: string
  hash: string
  parent: {
    id: number
    url: string | null
    path: string | null
  }
  order: number
}
export type JsonDisclaimerType = JsonCategoryType
export type JsonPoiType = {
  id: number
  url: string
  path: string
  title: string
  modified_gmt: string
  excerpt: string
  content: string
  available_languages: JsonAvailableLanguagesType
  thumbnail: string
  hash: string
  location: JsonLocationType
}
export type JsonEventType = {
  id: number
  url: string
  path: string
  title: string
  modified_gmt: string
  excerpt: string
  content: string
  available_languages: JsonAvailableLanguagesType
  thumbnail: string
  hash: string
  event: JsonEventInfoType
  location: JsonLocationType
  featured_image: JsonFeaturedImageType | null | undefined
}
export type JsonTunewsType = {
  id: number
  title: string
  tags: Array<string>
  date: string
  content: string
  enewsno: string
}
export type JsonLocalNewsType = {
  id: number
  timestamp: string
  title: string
  message: string
}
export type JsonOfferPostType = Record<string, string>
export type JsonOfferType = {
  alias: string
  name: string
  url: string
  thumbnail: string
  post: JsonOfferPostType | null | undefined
}

export type ShelterLanguage = 'deutsch' | 'englisch' | 'ukrainisch' | 'russisch' | 'polnisch' | 'kroatisch'
export type ShelterAccommodationType = 'ges_unterkunft' | 'privatzimmer' | 'gemein_zimmer'
export type ShelterInfo =
  | 'barrierefrei'
  | 'lgbtiq'
  | 'bad'
  | 'haustier-katze'
  | 'haustier-hund'
  | 'haustier'
  | 'rauchen'
export type ShelterPeriod = '7t' | '14t' | '1m' | '3m' | '6m' | '12m' | '12m_plus'
export type ShelterHostType = 'allein_maennlich' | 'allein_weiblich' | 'familie_kinder' | 'paar' | 'wg' | null
export type ShelterCostsType = 'uebergang-miete' | 'kostenpflichtig' | 'kostenfrei'
export type JsonShelterType = {
  id: number
  name: string
  city: string
  street: string | null
  zipcode: string
  languages: ShelterLanguage[]
  beds: string
  accommodation_type: ShelterAccommodationType
  info: ShelterInfo[]
  email: string | null
  phone: string | null
  rooms: string | null
  occupants: string | null
  start_date: string
  period: ShelterPeriod
  host_type: ShelterHostType
  costs: ShelterCostsType
  comments: string | null
}
export type JsonSprungbrettJobType = {
  title: string
  zip: string
  city: string
  url: string
  employment: string
  apprenticeship: string
}
export type LanguageDirectionType = 'ltr' | 'rtl'
export type JsonLanguageType = {
  code: string
  native_name: string
  dir: LanguageDirectionType
}
export type JsonTunewsLanguageType = {
  code: string
  name: string
}
export type JsonCityType = {
  name: string
  path: string
  live: boolean
  events: boolean
  extras: boolean
  pois: boolean
  tunews: boolean
  push_notifications: boolean
  name_without_prefix: string
  prefix: string | null | undefined
  latitude: number | null
  longitude: number | null
  aliases: Record<string, { longitude: number; latitude: number }> | null
  bounding_box: BBox
}
