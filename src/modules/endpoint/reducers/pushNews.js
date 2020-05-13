// @flow

import type { CityContentStateType, NewsRouteStateType } from '../../app/StateType'
import type { PushNewsActionType } from '../../app/StoreActionType'
import {
  LocalNewsModel,
  TunewsModel
} from '@integreat-app/integreat-api-client'

const pushNews = (state: CityContentStateType, action: PushNewsActionType): CityContentStateType => {
  const { newsList, path, key, language, cityLanguages, city, type, page, previouslyFetchedNewsList, hasMoreNews } = action.params
  if (!key) {
    throw new Error('You need to specify a key!')
  }
  const getNewsRoute = (): NewsRouteStateType => {
    if (!path) {
      const allAvailableLanguages = new Map(cityLanguages.map(language => [language.code, null]))
      if (page && previouslyFetchedNewsList) {
        return { status: 'ready', path: null, models: [...previouslyFetchedNewsList, ...newsList], hasMoreNews, allAvailableLanguages, language, city, type, page }
      }
      return { status: 'ready', path: null, models: newsList, allAvailableLanguages, language, city, type, page, hasMoreNews }
    }
    const newsItem: ?LocalNewsModel | TunewsModel = newsList.find(newsItem => `${newsItem.id}` === path)

    if (!newsItem) {
      throw new Error(`newsItem with path ${path} was not found in supplied models.`)
    }
    const allAvailableLanguages = new Map(newsItem.availableLanguages)
    allAvailableLanguages.set(language, path)

    return {
      status: 'ready',
      path,
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
