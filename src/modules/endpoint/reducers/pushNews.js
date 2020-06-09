// @flow

import type {
  CityContentStateType,
  NewsRouteStateType
} from '../../app/StateType'
import type { PushNewsActionType } from '../../app/StoreActionType'
import {
  LocalNewsModel,
  TunewsModel
} from '@integreat-app/integreat-api-client'
import ErrorCodes from '../../error/ErrorCodes'

const pushNews = (
  state: CityContentStateType,
  action: PushNewsActionType
): CityContentStateType => {
  const {
    news,
    newsId,
    key,
    language,
    cityLanguages,
    city,
    type,
    page,
    previouslyFetchedNews,
    hasMoreNews
  } = action.params
  if (!key) {
    throw new Error('You need to specify a key!')
  }
  const getNewsRoute = (): NewsRouteStateType => {
    if (!newsId) {
      const allAvailableLanguages = new Map(
        cityLanguages.map(language => [language.code, null])
      )
      const models = (page && previouslyFetchedNews)
        ? { models: [...previouslyFetchedNews, ...news] }
        : { models: news }

      return {
        status: 'ready',
        newsId: null,
        hasMoreNews,
        allAvailableLanguages,
        language,
        city,
        type,
        page,
        ...models
      }
    }
    const newsItem: ?LocalNewsModel | TunewsModel = news.find(
      newsItem => newsItem.id.toString() === newsId
    )

    if (!newsItem) {
      return {
        status: 'error',
        message: `News Item with newsId ${newsId} was not found in supplied models.`,
        code: ErrorCodes.PageNotFound,
        city,
        language,
        type,
        newsId: null
      }
    }

    const allAvailableLanguages = new Map(newsItem.availableLanguages)
    allAvailableLanguages.set(language, newsId)

    return {
      status: 'ready',
      newsId,
      models: [newsItem],
      allAvailableLanguages,
      language,
      city,
      type,
      page,
      hasMoreNews
    }
  }

  return {
    ...state,
    newsRouteMapping: { ...state.newsRouteMapping, [key]: getNewsRoute() }
  }
}

export default pushNews
