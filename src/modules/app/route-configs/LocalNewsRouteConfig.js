// @flow

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import type { Route } from 'redux-first-router'
import {
  createCitiesEndpoint,
  createEventsEndpoint,
  createLocalNewsEndpoint,
  createLanguagesEndpoint,
  LocalNewsModel,
  Payload
} from '@integreat-app/integreat-api-client'
import fetchData from '../fetchData'
import { cmsApiBaseUrl } from '../constants/urls'

type NewsRouteParamsType = {| city: string, language: string |}
type RequiredPayloadsType = {| localNews: Payload<Array<LocalNewsModel>> |}

export const LOCAL_NEWS_ROUTE = 'NEWS'

const newsRoute: Route = {
  path: '/:city/:language/news/local',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const { city, language } = state.location.payload

    await Promise.all([
      fetchData(createLocalNewsEndpoint(cmsApiBaseUrl), dispatch, state.localNews, { city, language }),
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, { city, language }),
      fetchData(createLanguagesEndpoint(cmsApiBaseUrl), dispatch, state.languages, { city, language })
    ])
  }
}

class LocalNewsRouteConfig implements RouteConfig<NewsRouteParamsType, RequiredPayloadsType> {
  name = LOCAL_NEWS_ROUTE
  route = newsRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getLanguageChangePath = ({ location, payloads, language }) => {
    const { city, newsId } = location.payload
    const localNews = payloads.localNews.data
    if (localNews && newsId) {
      const newsItem = localNews.find(_newsItem => _newsItem.path === location.pathname)
      return (newsItem && newsItem.availableLanguages.get(language)) || null
    }
    return this.getRoutePath({ city, language })
  }

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({ localNews: payloads.localNewsPayload })

  getPageTitle = ({ t, payloads, cityName, location }) => {
    if (!cityName) {
      return null
    }
    const pathname = location.pathname
    const localNews = payloads.localNews.data
    const newsItem = localNews && localNews.find(newsItem => newsItem.path === pathname)
    return `${newsItem ? newsItem.title : t('pageTitles.news')} - ${cityName}`
  }

  getRoutePath = ({ city, language }: NewsRouteParamsType): string => `/${city}/${language}/news/local`

  getMetaDescription = () => null

  getFeedbackTargetInformation = ({ payloads, location }) => {
    const localNews = payloads.localNews && payloads.localNews.data
    const newsItem = localNews && localNews.find(newsItem => newsItem.path === location.pathname)
    return newsItem ? { title: newsItem.title } : null
  }
}

export default LocalNewsRouteConfig
