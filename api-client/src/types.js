// @flow

export type JsonAvailableLanguagesType = {
  [string]: {|
    id: number,
    url: string,
    path: string
  |}
}

export type JsonLocationType = {|
  id: ?number,
  name: ?string,
  address: ?string,
  town: ?string,
  state: ?string,
  postcode: ?string,
  region: ?string,
  country: string,
  latitude: ?string,
  longitude: ?string
|}

type JsonFeaturedImageInstanceType = {|
  url: string,
  width: number,
  height: number
|}

type JsonFeaturedImageType = {|
  description: string,
  mimetype: string,
  thumbnail: Array<JsonFeaturedImageInstanceType>,
  medium: Array<JsonFeaturedImageInstanceType>,
  large: Array<JsonFeaturedImageInstanceType>,
  full: Array<JsonFeaturedImageInstanceType>
|}

type JsonEventInfoType = {|
  id: number,
  start_date: string,
  end_date: string,
  all_day: boolean,
  start_time: string,
  end_time: string,
  recurrence_id: ?string,
  timezone: string
|}

export type JsonCategoryType = {|
  id: number,
  url: string,
  path: string,
  title: string,
  modified_gmt: string,
  excerpt: string,
  content: string,
  available_languages: JsonAvailableLanguagesType,
  thumbnail: string,
  hash: string,
  parent: {|
    id: number,
    url: string | null,
    path: string | null
  |},
  order: number
|}

export type JsonDisclaimerType = JsonCategoryType

export type JsonPoiType = {|
  id: number,
  url: string,
  path: string,
  title: string,
  modified_gmt: string,
  excerpt: string,
  content: string,
  available_languages: JsonAvailableLanguagesType,
  thumbnail: string,
  hash: string,
  location: JsonLocationType
|}

export type JsonEventType = {|
  id: number,
  url: string,
  path: string,
  title: string,
  modified_gmt: string,
  excerpt: string,
  content: string,
  available_languages: JsonAvailableLanguagesType,
  thumbnail: string,
  hash: string,
  event: JsonEventInfoType,
  location: JsonLocationType,
  featured_image: ?JsonFeaturedImageType
|}

export type JsonTunewsType = {|
  id: number,
  title: string,
  tags: Array<string>,
  date: string,
  content: string,
  enewsno: string
|}

export type JsonLocalNewsType = {|
  id: number,
  timestamp: string,
  title: string,
  message: string
|}

export type JsonOfferPostType = {
  [key: string]: string
}

export type JsonOfferType = {|
  alias: string,
  name: string,
  url: string,
  thumbnail: string,
  post: ?JsonOfferPostType
|}

export type JsonSprungbrettJobType = {|
  title: string,
  zip: string,
  city: string,
  url: string,
  employment: string,
  apprenticeship: string
|}

// Generated with: https://transform.now.sh/json-to-flow-types/
type AccommodationType = {
  ofRooms: string[],
  title: string,
  location: string,
  totalArea: number,
  totalRooms: number,
  moveInDate: string,
  ofRoomsDiff: string[]
}

type CostsType = {
  ofRunningServices: string[],
  ofAdditionalServices: string[],
  baseRent: number,
  runningCosts: number,
  hotWaterInHeatingCosts: boolean,
  additionalCosts: number,
  ofRunningServicesDiff: string[],
  ofAdditionalServicesDiff: string[]
}

type LandlordType = {
  firstName: string,
  lastName: string,
  phone: string
}

type FormDataType = {
  landlord: LandlordType,
  accommodation: AccommodationType,
  costs: CostsType
}

export type OfferType = {
  email: string,
  formData: FormDataType,
  createdDate: string
}

export type LanguageDirectionType = 'ltr' | 'rtl'

export type JsonLanguageType = {| code: string, native_name: string, dir: LanguageDirectionType |}

export type JsonTunewsLanguageType = {| code: string, name: string |}

export type JsonCityType = {|
  name: string,
  path: string,
  live: boolean,
  events: boolean,
  extras: boolean,
  pois: boolean,
  tunews: boolean,
  push_notifications: boolean,
  name_without_prefix: string,
  prefix: ?string,
  latitude: number | null,
  longitude: number | null,
  aliases: { [alias: string]: {| longitude: number, latitude: number |} } | null
|}
