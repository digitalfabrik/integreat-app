// @flow

import type { NavigateToCategoryParamsType } from './createNavigateToCategory'
import createNavigateToCategory from './createNavigateToCategory'
import type { NavigateToEventParamsType } from './createNavigateToEvent'
import createNavigateToEvent from './createNavigateToEvent'
import type { StoreActionType } from './StoreActionType'
import type { Dispatch } from 'redux'
import URL from 'url-parse'
import type { NavigationPropType, RoutesType } from './components/NavigationTypes'

export type NavigateToInternalLinkParamsType = {| url: string, language: string |}

export const createNavigateToInternalLink = ({
  navigateToEvent,
  navigateToCategory,
  navigateToDashboard
}: {|
  navigateToEvent: NavigateToEventParamsType => void,
  navigateToCategory: NavigateToCategoryParamsType => void,
  navigateToDashboard: NavigateToCategoryParamsType => void
|}) => ({ url, language }: NavigateToInternalLinkParamsType) => {
  const parsedUrl = new URL(url)
  const pathname = parsedUrl.pathname
  const pathnameParts = pathname.split('/').filter(Boolean)
  const newCity = pathnameParts[0]
  const newLanguage = pathnameParts[1]

  if (pathnameParts[2] === 'events') {
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
  const navigateToCategory = createNavigateToCategory<T>('Categories', dispatch, navigation)
  const navigateToDashboard = createNavigateToCategory<T>('Dashboard', dispatch, navigation)
  const navigateToEvent = createNavigateToEvent<T>(dispatch, navigation)
  return createNavigateToInternalLink({ navigateToEvent, navigateToCategory, navigateToDashboard })
}

export default navigateToInternalLink
