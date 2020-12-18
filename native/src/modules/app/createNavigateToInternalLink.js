// @flow

import type { NavigateToCategoryParamsType } from './createNavigateToCategory'
import createNavigateToCategory from './createNavigateToCategory'
import type { NavigateToEventParamsType } from './createNavigateToEvent'
import createNavigateToEvent from './createNavigateToEvent'
import type { StoreActionType } from './StoreActionType'
import type { Dispatch } from 'redux'
import URL from 'url-parse'
import type { NavigationPropType, RoutesType } from './components/NavigationTypes'
import { CATEGORIES_ROUTE, DASHBOARD_ROUTE } from './components/NavigationTypes'
import createNavigateToLanding from './createNavigateToLanding'

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
  const newCity = pathnameParts[0]
  const newLanguage = pathnameParts[1]

  if (!newCity) { // '/'
    navigateToLanding()
  } else if (pathnameParts[2] === 'events') {
    if (pathnameParts[3]) { // '/augsburg/de/events/some_event'
      navigateToEvent({ cityCode: newCity, language: newLanguage, path: pathname })
    } else { // '/augsburg/de/events'
      navigateToEvent({ cityCode: newCity, language: newLanguage, path: null })
    }
  } else if (pathnameParts[2]) { // '/augsburg/de/willkommen'
    navigateToCategory({ cityCode: newCity, language: newLanguage, path: pathname })
  } else { // '/augsburg/de' or '/augsburg'
    const path = newLanguage ? pathname : `${pathname}/${language}`
    navigateToDashboard({ cityCode: newCity, language: newLanguage || language, path })
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
