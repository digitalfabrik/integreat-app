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
  appointmentOnly: boolean
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
  only_weekdays: boolean
}

export type OrganizationType = {
  name: string
  website: string
  logo: string
} | null

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
  organization: OrganizationType
  embedded_offers: JsonOfferType[]
}

export type JsonChatMessageType = {
  id: number
  content: string
  user_is_author: boolean
  automatic_answer: boolean
}

export type JsonChatMessagesType = {
  chatbot_typing: boolean
  messages: JsonChatMessageType[]
}

export type JsonDisclaimerType = JsonCategoryType

type JsonContactType = {
  name: string | null
  area_of_responsibility: string | null
  email: string | null
  phone_number: string | null
  website: string | null
  mobile_number: string | null
}

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
  temporarily_closed: boolean
  opening_hours: JsonOpeningHoursType[] | null
  appointment_url: string | null
  category: JsonPoiCategoryType
  contacts: JsonContactType[]
  organization: OrganizationType
  barrier_free: boolean | null
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
  location_path: string | null
  meeting_url: string | null
}

export type JsonTunewsType = {
  id: number
  title: string
  tags: string[]
  date: string
  content: string
  enewsno: string
}

export type JsonLocalNewsType = {
  id: number
  display_date: string
  title: string
  message: string
  available_languages: Record<string, { id: number }>
}

export type JsonOfferPostType = {
  'zammad-url': string | undefined
}

export type JsonOfferType = {
  alias: string
  name: string
  url: string
  thumbnail: string
  post?: JsonOfferPostType | null
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
  pois: boolean
  tunews: boolean
  push_notifications: boolean
  name_without_prefix: string
  prefix: string | null
  latitude: number
  longitude: number
  aliases: Record<string, { longitude: number; latitude: number }> | null
  bounding_box: [[number, number], [number, number]]
  is_chat_enabled: boolean
  zammad_privacy_policy: string | null
}

export type TimeSlot = {
  end: string
  start: string
  timezone: string
}
