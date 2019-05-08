// @flow

import createNavigateToCategory from './createNavigateToCategory'
import type { Dispatch } from 'redux'
import type { NavigationScreenProp } from 'react-navigation'
import createNavigateToEvent from './createNavigateToEvent'

export default (dispatch: Dispatch<*>, navigation: NavigationScreenProp<*>) =>
  (url: string, cityCode: string, language: string) => {
    const parts = url.split('/').filter(segment => segment)
    const pathnameParts = parts.splice(2)
    const pathname = pathnameParts.reduce((acc, part) => `${acc}/${part}`, '')

    if (pathnameParts[1] !== language) {
      dispatch({
        type: 'SWITCH_CONTENT_LANGUAGE',
        params: {
          city: pathnameParts[0],
          newLanguage: pathnameParts[1]
        }
      })
    }

    if (pathnameParts[0] === cityCode) {
      // same city
      if (pathnameParts[2] === 'events') {
        if (pathnameParts[3]) {
          // '/augsburg/de/events/some_event'
          createNavigateToEvent(dispatch, navigation)(cityCode, language, pathname)
        } else {
          // '/augsburg/de/events'
          createNavigateToEvent(dispatch, navigation)(cityCode, language)
        }
      } else if (pathnameParts[2]) {
        // '/augsburg/de/willkommen'
        createNavigateToCategory('Categories', dispatch, navigation)(cityCode, language, pathname)
      } else {
        // '/augsburg/de'
        createNavigateToCategory('Dashboard', dispatch, navigation)(
          cityCode, language, parts[1] ? pathname : `${pathname}/${language}`
        )
      }
    }
    // todo add support for linking to different cities
  }
