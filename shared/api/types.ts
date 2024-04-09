export type JsonAvailableLanguagesType = Record<
  string,
  {
    id: number
    url: string
    path: string
  }
>
export type JsonLocationType<T> = {
  id: T
  name: string
  address: string
  town: string
  postcode: string
  country: string
  latitude: T
  longitude: T
}
type JsonOpeningHoursType = {
  allDay: boolean
  closed: boolean
  timeSlots: TimeSlot[]
}

export type JsonPoiCategoryType = {
  id: number
  name: string
  color: string
  icon: string
  icon_url: string
}
type JsonFeaturedImageInstanceType = {
  url: string
  width: number
  height: number
}
type JsonFeaturedImageType = {
  description: string
  mimetype: string
  thumbnail: [JsonFeaturedImageInstanceType]
  medium: [JsonFeaturedImageInstanceType]
  large: [JsonFeaturedImageInstanceType]
  full: [JsonFeaturedImageInstanceType]
}
type JsonEventInfoType = {
  id: number
  start: string
  end: string
  all_day: boolean
  recurrence_id: string | null | undefined
}
export type JsonCategoryType = {
  id: number
  url: string
  path: string
  title: string
  last_updated: string
  excerpt: string
  content: string
  available_languages: JsonAvailableLanguagesType
  thumbnail: string | null
  parent: {
    id: number
    url: string | null
    path: string | null
  }
  order: number
  organization: {
    name: string
    logo: string
    website: string
  } | null
  embedded_offers: JsonOfferType[]
}
export type JsonDisclaimerType = JsonCategoryType
export type JsonPoiType = {
  id: number
  url: string
  path: string
  title: string
  last_updated: string
  excerpt: string
  meta_description: string | null
  content: string
  available_languages: JsonAvailableLanguagesType
  thumbnail: string | null
  location: JsonLocationType<number>
  website: string | null
  email: string | null
  phone_number: string | null
  temporarily_closed: boolean
  opening_hours: JsonOpeningHoursType[] | null
  category: JsonPoiCategoryType
}
export type JsonEventType = {
  id: number
  url: string
  path: string
  title: string
  last_updated: string
  excerpt: string
  content: string
  available_languages: JsonAvailableLanguagesType
  thumbnail: string | null
  event: JsonEventInfoType
  location: JsonLocationType<number | null>
  featured_image: JsonFeaturedImageType | null | undefined
  recurrence_rule?: string | null
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

export type JsonSprungbrettJobType = {
  title: string
  zip: string
  city: string
  url: string
  employment: string
  apprenticeship: string
}
export type JsonLanguageType = {
  code: string
  native_name: string
}
export type JsonTunewsLanguageType = {
  code: string
  name: string
}
export type JsonCityType = {
  name: string
  path: string
  live: boolean
  languages: JsonLanguageType[]
  events: boolean
  extras: boolean
  pois: boolean
  tunews: boolean
  push_notifications: boolean
  name_without_prefix: string
  prefix: string | null
  latitude: number
  longitude: number
  aliases: Record<string, { longitude: number; latitude: number }> | null
  bounding_box: [[number, number], [number, number]]
}

export type TimeSlot = {
  end: string
  start: string
}
