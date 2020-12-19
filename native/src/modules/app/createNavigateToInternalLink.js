// @flow

import type { NavigateToCategoryParamsType } from './createNavigateToCategory'
import createNavigateToCategory from './createNavigateToCategory'
import type { NavigateToEventParamsType } from './createNavigateToEvent'
import createNavigateToEvent from './createNavigateToEvent'
import type { StoreActionType } from './StoreActionType'
import type { Dispatch } from 'redux'
import URL from 'url-parse'
import type { NavigationPropType, RoutesType } from './components/NavigationTypes'
import { CATEGORIES_ROUTE, DASHBOARD_ROUTE, EVENTS_ROUTE } from './components/NavigationTypes'
import createNavigateToLanding from './createNavigateToLanding'
import { cityContentPath } from '../common/url'

export type NavigateToInternalLinkParamsType = {| url: string, language: string |}

export const createNavigateToInternalLink = ({
  navigateToLanding,
  navigateToEvent,
  navigateToCategory,
  navigateToDashboard
}: {|
  navigateToLanding: () => void,
  navigateToEvent: NavigateToEventParamsType => void,
  navigateToCategory: NavigateToCategoryParamsType => void,
  navigateToDashboard: NavigateToCategoryParamsType => void
|}) => ({ url, language }: NavigateToInternalLinkParamsType) => {
  const parsedUrl = new URL(url)
  const pathname = parsedUrl.pathname
  const pathnameParts = pathname.split('/').filter(Boolean)

  if (pathnameParts.length === 0) { // '/'
    navigateToLanding()
  } else if (pathnameParts.length === 1) { // '/augsburg'
    const cityCode = pathnameParts[0]
    navigateToDashboard({ cityCode, language, cityContentPath: cityContentPath({ cityCode, languageCode: language }) })
  } else if (pathnameParts.length === 2) { // '/augsburg/de'
    const cityCode = pathnameParts[0]
    const language = pathnameParts[1]
    navigateToDashboard({ cityCode, language, cityContentPath: pathname })
  } else if (pathnameParts.length > 2) {
    const newCity = pathnameParts[0]
    const newLanguage = pathnameParts[1]

    // TODO IGAPP-136: Handle other routes
    if (pathnameParts[2] === EVENTS_ROUTE.toLowerCase()) {
      if (pathnameParts[3]) { // '/augsburg/de/events/some_event'
        navigateToEvent({ cityCode: newCity, language: newLanguage, path: pathnameParts[3] })
      } else { // '/augsburg/de/events'
        navigateToEvent({ cityCode: newCity, language: newLanguage, path: null })
      }
    } else { // '/augsburg/de/willkommen'
      navigateToCategory({ cityCode: newCity, language: newLanguage, cityContentPath: pathname })
    }
  }
}

const navigateToInternalLink = <T: RoutesType>(
  dispatch: Dispatch<StoreActionType>,
  navigation: NavigationPropType<T>
) => {
  const navigateToLanding = createNavigateToLanding<T>(dispatch, navigation)
  const navigateToCategory = createNavigateToCategory<T>(CATEGORIES_ROUTE, dispatch, navigation)
  const navigateToDashboard = createNavigateToCategory<T>(DASHBOARD_ROUTE, dispatch, navigation)
  const navigateToEvent = createNavigateToEvent<T>(dispatch, navigation)
  return createNavigateToInternalLink({ navigateToLanding, navigateToEvent, navigateToCategory, navigateToDashboard })
}

export default navigateToInternalLink
