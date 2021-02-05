// @flow

import createNavigationScreenPropMock from '../../../testing/createNavigationPropMock'
import createNavigateToEvent from '../createNavigateToEvent'

const cityContentUrl = ({ cityCode, languageCode, route, path }) => `/${cityCode}/${languageCode}/${route}${path || ''}`
const url = path => `some.base.url/${path}`
jest.mock('../../common/url', () => ({
  cityContentUrl: jest.fn(cityContentUrl),
  url: jest.fn(url)
}))

const cityCode = 'augsburg'
const language = 'de'
const cityContentPath = '/augsburg/de/integrationskurs'

describe('createNavigateToEvent', () => {
  it('should generate key if not supplied with at least 6 chars and use it for both navigation and redux actions', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    const navigateToEvent = createNavigateToEvent(dispatch, navigation)
    navigateToEvent({ cityCode, language, cityContentPath })

    expect(navigation.navigate).toHaveBeenCalledWith(expect.objectContaining({
      key: expect.stringMatching(/^.{6,}$/) // at least 6 chars but no newline
    }))
    const key = (navigation.navigate: any).mock.calls[0][0].key
    expect(dispatch).toHaveBeenCalledWith({
      type: 'FETCH_EVENT',
      params: expect.objectContaining({ key })
    })
  })

  it('should dispatch a FETCH_EVENT action and refresh resources on force refresh', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    const navigateToEvent = createNavigateToEvent(dispatch, navigation)
    navigateToEvent({
      cityCode: 'augsburg',
      language: 'de',
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
