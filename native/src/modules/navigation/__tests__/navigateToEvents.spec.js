// @flow

import createNavigationScreenPropMock from '../../../testing/createNavigationPropMock'
import navigateToEvents from '../navigateToEvents'
import { EVENTS_ROUTE } from 'api-client/src/routes'

const cityContentUrl = ({ cityCode, languageCode, route, path }) => `/${cityCode}/${languageCode}/${route}${path || ''}`
const url = path => `some.base.url/${path}`
jest.mock('../url', () => ({
  cityContentUrl: jest.fn(cityContentUrl),
  url: jest.fn(url)
}))

const cityCode = 'augsburg'
const languageCode = 'de'
const route = EVENTS_ROUTE
const cityContentPath = '/augsburg/de/integrationskurs'

describe('createNavigateToEvents', () => {
  it('should generate key if not supplied with at least 6 chars and use it for both navigation and redux actions', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    navigateToEvents({ dispatch, navigation, cityCode, languageCode, cityContentPath })

    expect(navigation.navigate).toHaveBeenCalledWith(expect.objectContaining({
      key: expect.stringMatching(/^.{6,}$/) // at least 6 chars but no newline
    }))
    const key = (navigation.navigate: any).mock.calls[0][0].key
    expect(dispatch).toHaveBeenCalledWith({
      type: 'FETCH_EVENT',
      params: expect.objectContaining({ key })
    })
  })

  it('should pass path, or the events path if not supplied, as sharePath in navigation params', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    navigateToEvents({ dispatch, navigation, cityCode, languageCode, cityContentPath })
    expect(navigation.navigate).toHaveBeenCalledWith(expect.objectContaining({
      params: expect.objectContaining({
        shareUrl: url(cityContentPath)
      })
    }))

    navigateToEvents({ dispatch, navigation, cityCode, languageCode, cityContentPath: null })
    expect(navigation.navigate).toHaveBeenCalledWith(expect.objectContaining({
      params: expect.objectContaining({
        shareUrl: cityContentUrl({ cityCode, languageCode: languageCode, route, path: null })
      })
    }))
  })

  it('should dispatch a FETCH_EVENT action and refresh resources on force refresh', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    navigateToEvents({
      dispatch,
      navigation,
      cityCode: 'augsburg',
      languageCode: 'de',
      cityContentPath: '/augsburg/de/events',
      key: 'route-id-1',
      forceRefresh: true
    })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'FETCH_EVENT',
      params: {
        city: 'augsburg',
        language: 'de',
        path: '/augsburg/de/events',
        key: 'route-id-1',
        criterion: { forceUpdate: true, shouldRefreshResources: true }
      }
    })
  })
})
