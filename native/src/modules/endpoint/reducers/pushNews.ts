import { CityContentStateType, NewsRouteStateType } from '../../app/StateType'
import { PushNewsActionType } from '../../app/StoreActionType'
import { LocalNewsModel, NEWS_ROUTE, TunewsModel } from 'api-client'
import { ErrorCode } from '../../error/ErrorCodes'

const pushNews = (state: CityContentStateType, action: PushNewsActionType): CityContentStateType => {
  const {
    news,
    newsId,
    key,
    language,
    availableLanguages,
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
      const allAvailableLanguages = new Map(availableLanguages.map(language => [language.code, null]))
      const models =
        page && previouslyFetchedNews
          ? {
              models: [...previouslyFetchedNews, ...news]
            }
          : {
              models: news
            }
      return {
        routeType: NEWS_ROUTE,
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

    const newsItem: (LocalNewsModel | null | undefined) | TunewsModel = news.find(
      newsItem => newsItem.id.toString() === newsId
    )

    if (!newsItem) {
      return {
        routeType: NEWS_ROUTE,
        status: 'error',
        message: `News Item with newsId ${newsId} was not found in supplied models.`,
        code: ErrorCode.PageNotFound,
        city,
        language,
        type,
        newsId: null
      }
    }

    const allAvailableLanguages = availableLanguages.filter(languageModel => languageModel.code === language)
    return {
      routeType: NEWS_ROUTE,
      status: 'ready',
      newsId,
      models: [newsItem],
      allAvailableLanguages: new Map(allAvailableLanguages.map(language => [language.code, null])),
      language,
      city,
      type,
      page,
      hasMoreNews
    }
  }

  return { ...state, routeMapping: { ...state.routeMapping, [key]: getNewsRoute() } }
}

export default pushNews
