import { DateTime } from 'luxon'

import mapAvailableLanguages from '../mapAvailableLanguages'
import CategoryModel from '../models/CategoryModel'
import { JsonCategoryType } from '../types'

const mapCategoryJson = (json: JsonCategoryType, basePath: string): CategoryModel =>
  new CategoryModel({
    root: false,
    path: json.path,
    title: json.title,
    content: json.content,
    thumbnail: json.thumbnail,
    order: json.order,
    availableLanguages: mapAvailableLanguages(json.available_languages),
    parentPath: json.parent.path || basePath,
    lastUpdate: DateTime.fromJSDate(new Date(json.modified_gmt), { zone: 'GMT' }),
  })

export default mapCategoryJson
