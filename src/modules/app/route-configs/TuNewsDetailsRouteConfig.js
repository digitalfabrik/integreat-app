

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
import { cmsApiBaseUrl, tuNewsApiBaseUrl } from '../constants/urls'

type RequiredPayloadsType = {| news: Payload<Array<TuNewsElementModel>> |}

export const TUNEWS_DETAILS_ROUTE = 'TUNEWS_DETAILS'

/**
 * EventsRoute, matches /augsburg/de/events and /augsburg/de/events/begegnungscafe
 * @type {{path: string, thunk: function(Dispatch, GetState)}}
 */
const tuNewsDetailsRoute: Route = {
  path: '/:city/:language/news/tu-news/:newsId',
  thunk: async (dispatch, getState) => {
    const state = getState()
    const newsId = state.location.payload.newsId;
    const { city, language } = state.location.payload

    await Promise.all([
      fetchData(createTuNewsElementEndpoint(tuNewsApiBaseUrl), dispatch, state.tunews_element, { id: newsId }),
      fetchData(createCitiesEndpoint(cmsApiBaseUrl), dispatch, state.cities),
      fetchData(createEventsEndpoint(cmsApiBaseUrl), dispatch, state.events, { city, language })
    ])
  }
}

class TuNewsDetailsRouteConfig implements RouteConfig<RequiredPayloadsType> {
  name = TUNEWS_DETAILS_ROUTE
  route = tuNewsDetailsRoute
  isLocationLayoutRoute = true
  requiresHeader = true
  requiresFooter = true

  getLanguageChangePath = () => null

  getRequiredPayloads = (payloads: AllPayloadsType): RequiredPayloadsType => ({ tuNewsElementDetails: payloads.tuNewsElementPayload })

  getPageTitle = ({ t, payloads, cityName, location }) => {
    const tunewsItem = payloads.tuNewsElementDetails.data
    const tunewsItemTitle = tunewsItem && `${t('pageTitles.tuNews')} | ` + tunewsItem._title
    return `${tunewsItemTitle ? tunewsItemTitle : t('pageTitles.tuNews')}`
  }

  getRoutePath = ({ city, language }): string => null;

  getMetaDescription = () => null

  getFeedbackTargetInformation = () => null
}

export default TuNewsDetailsRouteConfig
