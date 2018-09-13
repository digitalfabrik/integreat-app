// @flow

import type { JsonAvailableLanguagesType, JsonLocationType, JsonPathType } from './JsonCommonTypes'

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
