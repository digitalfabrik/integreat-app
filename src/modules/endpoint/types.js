// @flow

export type JsonPathType = {
  id: number,
  url: ?string,
  path: ?string
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
  recurrence_id: ?string
}

export type JsonEventType = {
  id: number,
  url: string,
  path: string,
  title: string,
  modified_gmt: string,
  excerpt: string,
  content: string,
  parent: JsonPathType,
  order: number,
  available_languages: JsonAvailableLanguagesType,
  thumbnail: string,
  event: JsonEventInfoType,
  location: JsonLocationType,
  hash: string
}

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
  location: JsonLocationType,
  hash: string
}
