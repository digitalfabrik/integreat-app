

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
import { cmsApiBaseUrl,  localNewsApiBaseUrl } from '../constants/urls'

type LocalNewsDetailsType = {| city: string, language: string |}
type RequiredPayloadsType = {| news: Payload<Array<LocalNewsModel>> |}

export const LOCAL_NEWS_DETAILS_ROUTE = 'LOCAL_NEWS_DETAILS'

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/begegnungscafe
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const localNewsDetailsRoute: Route = {
  path: '/:city/:language/news/local/:title',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const { city, language } = state.location.payload

    await Promise.all([
      fetchData(createLocalNewsEndpoint(localNewsApiBaseUrl), dispatch, state.news, { city, language }),
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, { city, language }),
      fetchData(createLanguagesEndpoint(cmsApiBaseUrl), dispatch, state.languages, { city, language })
    ])
  }
}

class LocalNewsDetailsRouteConfig implements RouteConfig<LocalNewsDetailsType, RequiredPayloadsType> {
  name = LOCAL_NEWS_DETAILS_ROUTE
  route = localNewsDetailsRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getLanguageChangePath = ({ location, payloads, language }) => {
  }

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({ localNewsList: payloads.newsPayload })

  getPageTitle = ({ t, payloads, cityName, location }) => {
    if (!cityName) {
      return null
    }

    const news = payloads.localNewsList
    const newsItem = news && news.find(newsItem => newsItem.title === location.payload.title)
    return `${newsItem ? newsItem.title : t('pageTitles.news')} - ${cityName}`
  }

  getRoutePath = ({ city, language }: LocalNewsDetailsType): string => '/${city}/${language}/news/local/:title'

  getMetaDescription = () => null

  getFeedbackTargetInformation = ({ payloads, location }) => {
    const news = payloads.localNewsList
    const newsItem = news && news.find(newsItem => newsItem.title === location.payload.title)
    return newsItem ? { title: newsItem.title } : null
  }
}

export default LocalNewsDetailsRouteConfig
