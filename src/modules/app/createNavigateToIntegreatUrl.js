// @flow

import createNavigateToCategory from './createNavigateToCategory'
import type { Dispatch } from 'redux'
import type { NavigationScreenProp } from 'react-navigation'
import createNavigateToEvent from './createNavigateToEvent'
import type { PushContentLanguageActionType } from './StoreActionType'

export default (dispatch: Dispatch<*>, navigation: NavigationScreenProp<*>) =>
  ({url, cityCode, language}: {|url: string, cityCode: string, language: string|}) => {
    const parts = url.split('/').filter(segment => segment)
    const pathnameParts = parts.splice(2)
    const newCity = pathnameParts[0]
    const newLanguage = pathnameParts[1]
    const pathname = pathnameParts.reduce((acc, part) => `${acc}/${part}`, '')

    // todo add support for linking to different cities

    if (newCity === cityCode) {
      // same city

      if (newLanguage !== language) {
        const pushContentLanguage: PushContentLanguageActionType = {
          type: 'PUSH_CONTENT_LANGUAGE',
          params: {
            newLanguage
          }
        }
        dispatch(pushContentLanguage)
      }

      if (pathnameParts[2] === 'events') {
        if (pathnameParts[3]) {
          // '/augsburg/de/events/some_event'
          createNavigateToEvent(dispatch, navigation)(
            {cityCode, language: newLanguage, path: pathname, previousLanguage: language})
        } else {
          // '/augsburg/de/events'
          createNavigateToEvent(dispatch, navigation)(
            {cityCode, language: newLanguage, previousLanguage: language})
        }
      } else if (pathnameParts[2]) {
        // '/augsburg/de/willkommen'
        createNavigateToCategory('Categories', dispatch, navigation)(
          {cityCode, language: newLanguage, previousLanguage: language, path: pathname})
      } else {
        // '/augsburg/de' or '/augsburg'
        const path = newLanguage ? pathname : `${pathname}/${language}`
        createNavigateToCategory('Dashboard', dispatch, navigation)(
          {cityCode, language: newLanguage || language, path, previousLanguage: language}
        )
      }
    }
  }
