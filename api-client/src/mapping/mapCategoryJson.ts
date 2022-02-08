import moment from 'moment-timezone'

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
    lastUpdate: moment.tz(json.modified_gmt, 'GMT'),
    hash: json.hash
  })

export default mapCategoryJson
