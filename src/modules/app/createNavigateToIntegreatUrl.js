// @flow

import createNavigateToCategory from './createNavigateToCategory'
import type { Dispatch } from 'redux'
import type { NavigationScreenProp } from 'react-navigation'
import createNavigateToEvent from './createNavigateToEvent'
import type { StoreActionType } from './StoreActionType'

export type NavigateToIntegreatUrlParamsType = {| url: string, cityCode: string, language: string |}

export default (dispatch: Dispatch<StoreActionType>, navigation: NavigationScreenProp<*>) =>
  ({ url, cityCode, language }: NavigateToIntegreatUrlParamsType) => {
    const parts = url.split('/').filter(segment => segment)
    const pathnameParts = parts.splice(2)
    const newCity = pathnameParts[0]
    const newLanguage = pathnameParts[1]
    const pathname = pathnameParts.reduce((acc, part) => `${acc}/${part}`, '')

    const peek = newCity !== cityCode /* If switching the city we want to peek. If we are in the same city we should
                                         not peek */

    if (pathnameParts[2] === 'events') {
      if (pathnameParts[3]) {
        // '/augsburg/de/events/some_event'
        createNavigateToEvent(dispatch, navigation)({ cityCode, language: newLanguage, path: pathname, peek })
      } else {
        // '/augsburg/de/events'
        createNavigateToEvent(dispatch, navigation)({ cityCode, language: newLanguage, peek })
      }
    } else if (pathnameParts[2]) {
      // '/augsburg/de/willkommen'
      createNavigateToCategory('Categories', dispatch, navigation)(
        { cityCode: newCity, language: newLanguage, path: pathname, peek })
    } else {
      // '/augsburg/de' or '/augsburg'
      const path = newLanguage ? pathname : `${pathname}/${language}`
      createNavigateToCategory('Dashboard', dispatch, navigation)(
        { cityCode: newCity, language: newLanguage || language, path, peek }
      )
    }
  }
