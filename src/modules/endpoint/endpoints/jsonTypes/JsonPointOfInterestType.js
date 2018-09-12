// @flow

import type { JsonLanguageType, JsonLocationType } from './JsonCommonTypes'

export type JsonPointOfInterestType = {
  id: number,
  url: string,
  path: string,
  title: string,
  modified_gmt: string,
  excerpt: string,
  content: string,
  available_languages: JsonLanguageType,
  thumbnail: string,
  location: JsonLocationType,
  hash: string
}
