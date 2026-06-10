import { AMAL_NEWS_SOURCE, LOCAL_NEWS_SOURCE, NewsSource, TU_NEWS_SOURCE } from '../api/constants/index.ts'
import { NEWS_LOCAL_SOURCES_FILTER, NEWS_NATIONAL_SOURCES_FILTER, NewsSourceFilter } from '../constants/index.ts'

export const newsFilterToSources = (newsSourcesFilter?: NewsSourceFilter): NewsSource[] | null => {
  switch (newsSourcesFilter) {
    case NEWS_LOCAL_SOURCES_FILTER:
      return [LOCAL_NEWS_SOURCE]
    case NEWS_NATIONAL_SOURCES_FILTER:
      return [TU_NEWS_SOURCE, AMAL_NEWS_SOURCE]
  }
  return null
}
