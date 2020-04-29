// @flow

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import type { Route } from 'redux-first-router'
import {
  createCitiesEndpoint,
  createEventsEndpoint,
  createLocalNewsEndpoint,
  createTuNewsListEndpoint,
  createLanguagesEndpoint,
  LocalNewsModel,
  Payload
} from '@integreat-app/integreat-api-client'
import fetchData from '../fetchData'
import { cmsApiBaseUrl, tuNewsApiBaseUrl, localNewsApiBaseUrlDev } from '../constants/urls'

type NewsRouteParamsType = {| city: string, language: string |}
type RequiredPayloadsType = {| news: Payload<Array<LocalNewsModel>> |}

export const NEWS_ROUTE = 'NEWS'

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/begegnungscafe
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const newsRoute: Route = {
  path: '/:city/:language/news/local',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const { city, language } = state.location.payload

    await Promise.all([
      fetchData(createLocalNewsEndpoint(localNewsApiBaseUrlDev), dispatch, state.news, { city, language }),
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, { city, language }),
      fetchData(createLanguagesEndpoint(cmsApiBaseUrl), dispatch, state.languages, { city, language })
    ])
  }
}

class NewsRouteConfig implements RouteConfig<NewsRouteParamsType, RequiredPayloadsType> {
  name = NEWS_ROUTE
  route = newsRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getLanguageChangePath = ({ location, payloads, language }) => {
    const { city, newsId } = location.payload
    const news = payloads.news.data
    if (news && newsId) {
      const newsItem = news.find(_newsItem => _newsItem.path === location.pathname)
      return (newsItem && newsItem.availableLanguages.get(language)) || null
    }
    return this.getRoutePath({ city, language })
  }

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({ news: payloads.newsPayload })

  getPageTitle = ({ t, payloads, cityName, location }) => {
    if (!cityName) {
      return null
    }
    const pathname = location.pathname
    const news = payloads.news.data
    const newsItem = news && news.find(newsItem => newsItem.path === pathname)
    return `${newsItem ? newsItem.title : t('pageTitles.news')} - ${cityName}`
  }

  getRoutePath = ({ city, language }: NewsRouteParamsType): string => `/${city}/${language}/news/local`

  getMetaDescription = () => null

  getFeedbackTargetInformation = ({ payloads, location }) => {
    const news = payloads.news && payloads.news.data
    const newsItem = news && news.find(newsItem => newsItem.path === location.pathname)
    return newsItem ? { id: newsItem.id, title: newsItem.title } : null
  }
}

export default NewsRouteConfig
