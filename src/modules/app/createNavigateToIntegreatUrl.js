// @flow

import createNavigateToCategory from './createNavigateToCategory'
import type { Dispatch } from 'redux'
import type { NavigationScreenProp } from 'react-navigation'
import createNavigateToEvent from './createNavigateToEvent'

export default (dispatch: Dispatch<*>, navigation: NavigationScreenProp<*>) =>
  (url: string, cityCode: string, language: string) => {
    const pathname = new URL(decodeURIComponent(url)).pathname
    const parts = pathname.split('/')

    if (parts[0] === cityCode && parts[1] === language) {
      // same city and language
      if (parts[2] === 'events') {
        if (parts[3]) {
          // '/augsburg/de/events/some_event'
          createNavigateToEvent(dispatch, navigation)(cityCode, language, pathname)
        } else {
          // '/augsburg/de/events
          createNavigateToEvent(dispatch, navigation)(cityCode, language)
        }
      } else if (parts[2]) {
        // '/augsburg/de/willkommen'
        createNavigateToCategory('Categories', dispatch, navigation)(cityCode, language, pathname)
      } else {
        // '/augsburg/de'
        createNavigateToCategory('Dashboard', dispatch, navigation)(cityCode, language, pathname)
      }
    }
  }
