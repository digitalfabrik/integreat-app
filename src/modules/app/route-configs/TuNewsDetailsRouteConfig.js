

import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import type { Route } from 'redux-first-router'
import {
  TuNewsElementModel,
  Payload,
  createTuNewsElementEndpoint,
  createCitiesEndpoint,
  createEventsEndpoint
} from '@integreat-app/integreat-api-client'
import fetchData from '../fetchData'
import { cmsApiBaseUrl, tunewsApiBaseUrl } from '../constants/urls'

type RequiredPayloadsType = {| news: Payload<Array<TuNewsElementModel>> |}

export const TUNEWS_DETAILS_ROUTE = 'TUNEWS_DETAILS'

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/begegnungscafe
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const newsRoute: Route = {
  path: '/:city/:language/news/tu-news/:newsId?',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const newsId = state.location.payload.newsId;
    const { city, language } = state.location.payload

    await Promise.all([
      fetchData(createTuNewsElementEndpoint(tunewsApiBaseUrl), dispatch, state.tunews_element, { id: newsId }),
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, { city, language }),
      // fetchData(createLanguagesEndpoint(cmsApiBaseUrl), dispatch, state.languages, { city, language })
    ])
  }
}

class TuNewsDetailsRouteConfig implements RouteConfig<RequiredPayloadsType> {
  name = TUNEWS_DETAILS_ROUTE
  route = newsRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true
  currentLocation = null;

  getLanguageChangePath = () => null

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({ payloads: payloads.tuNewsElementPayload })

  getPageTitle = ({ t, payloads, cityName, location }) => {
    console.log('title payloads', payloads)
    console.log('title location', location)

    // if (!cityName) {
    //   return null
    // }
    // const pathname = location.pathname
    // const news = payloads.news.data
    // const newsItem = news && news.find(newsItem => newsItem.path === pathname)
    // return `${newsItem ? newsItem.title : t('pageTitles.tuNews')} - ${cityName}`
  }

  getRoutePath = ({ city, language }): string => null;

  getMetaDescription = () => null

  getFeedbackTargetInformation = ({ payloads, location }) => {
    // const news = payloads.news && payloads.news.data
    // const newsItem = news && news.find(newsItem => newsItem.path === location.pathname)
    // return newsItem ? { id: newsItem.id, title: newsItem.title } : null
  }
}

export default TuNewsDetailsRouteConfig
