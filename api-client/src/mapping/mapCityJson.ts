import { BBox } from 'geojson'

import CityModel from '../models/CityModel'
import LanguageModel from '../models/LanguageModel'
import { JsonCityType, JsonLanguageType } from '../types'

const stripSlashes = (path: string): string => {
  let code = path
  if (code.startsWith('/')) {
    code = code.substring(1)
  }

  if (code.endsWith('/')) {
    code = code.substring(0, code.length - 1)
  }

  return code
}

const mapLanguagesJson = (json: JsonLanguageType[]) =>
  json
    .map((language: JsonLanguageType) => new LanguageModel(language.code, language.native_name))
    .sort((lang1, lang2) => lang1.code.localeCompare(lang2.code))

const mapCityJson = (json: JsonCityType): CityModel =>
  new CityModel({
    name: json.name,
    code: stripSlashes(json.path),
    live: json.live,
    languages: mapLanguagesJson(json.languages),
    eventsEnabled: json.events,
    offersEnabled: json.extras,
    poisEnabled: json.pois,
    tunewsEnabled: json.tunews,
    localNewsEnabled: json.push_notifications,
    sortingName: json.name_without_prefix,
    prefix: json.prefix,
    longitude: json.longitude,
    latitude: json.latitude,
    aliases: json.aliases,
    boundingBox: Array.isArray(json.bounding_box) ? ([...json.bounding_box[0], ...json.bounding_box[1]] as BBox) : null,
  })

export default mapCityJson
