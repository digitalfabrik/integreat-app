// @flow

import type { NavigateToCategoryParamsType } from './createNavigateToCategory'
import createNavigateToCategory from './createNavigateToCategory'
import type { NavigateToEventParamsType } from './createNavigateToEvent'
import createNavigateToEvent from './createNavigateToEvent'
import type { NavigationScreenProp } from 'react-navigation'
import type { StoreActionType } from './StoreActionType'
import createNavigateToLanding from './createNavigateToLanding'
import type { Dispatch } from 'redux'

export type NavigateToIntegreatUrlParamsType = {| url: string, language: string |}

export const createNavigateToIntegreatUrl = ({ navigateToLanding, navigateToEvent, navigateToCategory, navigateToDashboard }: {
  navigateToLanding: () => void,
  navigateToEvent: NavigateToEventParamsType => void,
  navigateToCategory: NavigateToCategoryParamsType => void,
  navigateToDashboard: NavigateToCategoryParamsType => void
}) => ({ url, language }: NavigateToIntegreatUrlParamsType) => {
  const parts = url.split('/').filter(segment => segment)
  const pathnameParts = parts.splice(2)
  const newCity = pathnameParts[0]
  const newLanguage = pathnameParts[1]
  const pathname = pathnameParts.reduce((acc, part) => `${acc}/${part}`, '')

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

export default (dispatch: Dispatch<StoreActionType>, navigation: NavigationScreenProp<*>) => {
  const navigateToCategory = createNavigateToCategory('Categories', dispatch, navigation)
  const navigateToDashboard = createNavigateToCategory('Dashboard', dispatch, navigation)
  const navigateToEvent = createNavigateToEvent(dispatch, navigation)
  const navigateToLanding = createNavigateToLanding(dispatch, navigation)
  return createNavigateToIntegreatUrl({ navigateToLanding, navigateToEvent, navigateToCategory, navigateToDashboard })
}
