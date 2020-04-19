
import type { AllPayloadsType } from './RouteConfig'
import { RouteConfig } from './RouteConfig'
import type { Route } from 'redux-first-router'
import fetchData from '../fetchData'
import { cmsApiBaseUrl } from '../constants/urls'

type LocalNewsDetailsRouteParamsType = {| city: string, language: string |}

export const LOCAL_NEWS_DETAILS = 'LOCAL_NEWS_DETAILS'

class LocalNewsDetailsRouteConfig implements RouteConfig<LocalNewsDetailsRouteParamsType> {
  name = LOCAL_NEWS_DETAILS
  route = () => {
    console.log('came here ya')
  };
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

  getPageTitle = ({ t, payloads, cityName, location }) => {
    if (!cityName) {
      return null
    }
    const pathname = location.pathname
    const news = payloads.news.data
    const newsItem = news && news.find(newsItem => newsItem.path === pathname)
    return `${newsItem ? newsItem.title : t('pageTitles.news')} - ${cityName}`
  }

  getRoutePath = ({ city, language }: NewsRouteParamsType): string => `/${city}/${language}/news/local/:title`

  getMetaDescription = () => null

  getFeedbackTargetInformation = ({ payloads, location }) => {
    const news = payloads.news && payloads.news.data
    const newsItem = news && news.find(newsItem => newsItem.path === location.pathname)
    return newsItem ? { id: newsItem.id, title: newsItem.title } : null
  }

}

export default LocalNewsDetailsRouteConfig
