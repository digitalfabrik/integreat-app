// @flow

import type { NavigateToCategoryParamsType } from './createNavigateToCategory'
import createNavigateToCategory from './createNavigateToCategory'
import type { NavigateToEventParamsType } from './createNavigateToEvent'
import createNavigateToEvent from './createNavigateToEvent'
import type { NavigationStackProp } from 'react-navigation-stack'
import type { StoreActionType } from './StoreActionType'
import createNavigateToLanding from './createNavigateToLanding'
import type { Dispatch } from 'redux'
import URL from 'url-parse'

export type NavigateToInternalLinkParamsType = {| url: string, language: string |}

export const createNavigateToInternalLink = ({
  navigateToLanding,
  navigateToEvent,
  navigateToCategory,
  navigateToDashboard
}: {
  navigateToLanding: () => void,
  navigateToEvent: NavigateToEventParamsType => void,
  navigateToCategory: NavigateToCategoryParamsType => void,
  navigateToDashboard: NavigateToCategoryParamsType => void
}) => ({ url, language }: NavigateToInternalLinkParamsType) => {
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

export default (dispatch: Dispatch<StoreActionType>, navigation: NavigationStackProp<*>) => {
  const navigateToCategory = createNavigateToCategory('Categories', dispatch, navigation)
  const navigateToDashboard = createNavigateToCategory('Dashboard', dispatch, navigation)
  const navigateToEvent = createNavigateToEvent(dispatch, navigation)
  const navigateToLanding = createNavigateToLanding(dispatch, navigation)
  return createNavigateToInternalLink({ navigateToLanding, navigateToEvent, navigateToCategory, navigateToDashboard })
}
