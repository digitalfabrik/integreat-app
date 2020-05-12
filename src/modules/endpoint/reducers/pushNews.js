// @flow

import type { CityContentStateType } from '../../app/StateType'
import type { PushNewsActionType } from '../../app/StoreActionType'

const pushNews = (state: CityContentStateType, action: PushNewsActionType): CityContentStateType => {
  const { newsList, path, key, language, cityLanguages, city, type, page, oldNewsList, hasMoreNews } = action.params
  if (!key) {
    throw new Error('You need to specify a key!')
  }
  const getNewsRoute = (): any => {
    if (!path) {
      const allAvailableLanguages = new Map(cityLanguages.map(language => [language.code, null]))
      if (page && oldNewsList) {
        return { status: 'ready', path: null, models: [...oldNewsList, ...newsList], hasMoreNews, allAvailableLanguages, language, city, type, page }
      }
      return { status: 'ready', path: null, models: newsList, allAvailableLanguages, language, city, type, page, hasMoreNews }
    }
    const newsItem: ?any = newsList.find(newsItem => `${newsItem.id}` === path)

    if (!newsItem) {
      throw new Error(`News Item with path ${path} was not found in supplied models.`)
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
