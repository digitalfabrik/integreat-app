import { DateTime } from 'luxon'

import NewsModel from '../models/NewsModel.ts'
import { JsonNewsType } from '../types.ts'

const mapNewsAvailableLanguages = (json: Record<string, { id: number }> | null): Record<string, number> | null =>
  json
    ? Object.entries(json).reduce(
        (availableLanguages, [code, value]) => ({ ...availableLanguages, [code]: value.id }),
        {},
      )
    : null

const mapNewsJson = (json: JsonNewsType): NewsModel =>
  new NewsModel({
    id: json.id,
    title: json.title,
    content: json.content,
    source: json.source,
    lastUpdate: DateTime.fromISO(json.display_date),
    availableLanguages: mapNewsAvailableLanguages(json.available_languages),
    externalUrl: json.externalUrl,
  })

export default mapNewsJson
