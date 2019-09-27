// @flow

export type JsonPathType = {
  id: number,
  url: string,
  path: string
}

export type JsonAvailableLanguagesType = {
  [string]: JsonPathType
}

export type JsonLocationType = {
  id: number,
  name: string,
  address: string,
  town: string,
  state: ?string,
  postcode: ?string,
  region: ?string,
  country: string,
  latitude: ?string,
  longitude: ?string
}

type JsonEventInfoType = {
  id: number,
  start_date: string,
  end_date: string,
  all_day: boolean,
  start_time: string,
  end_time: string,
  recurrence_id: ?string,
  timezone: string
}

export type JsonCategoryType = {
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
  parent: JsonPathType,
  order: number
}

export type JsonDisclaimerType = JsonCategoryType

export type JsonPoiType = {
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
}

export type JsonEventType = {
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
  location: JsonLocationType
}

export type JsonExtraPostType = {
  [key: string]: string
}

export type JsonExtraType = {
  alias: string,
  name: string,
  url: string,
  thumbnail: string,
  post: ?JsonExtraPostType
}

export type JsonSprungbrettJobType = {
  title: string, zip: string, city: string, url: string, employment: string, apprenticeship: string
}

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

export type JsonLanguageType = { code: string, native_name: string }

export type JsonCityType = {
  name: string,
  path: string,
  live: boolean,
  events: boolean,
  extras: boolean,
  name_without_prefix: string,
  prefix: ?string,
  latitude: number | null,
  longitude: number | null
}
