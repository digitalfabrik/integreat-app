// @flow

import createNavigationScreenPropMock from '../../test-utils/createNavigationScreenPropMock'
import createNavigateToNews from '../createNavigateToNews'

describe('createNavigateToNews', () => {
  it('should generate key if not supplied with at least 6 chars and use it for both navigation and redux actions', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    const navigateToNews = createNavigateToNews(dispatch, navigation)
    navigateToNews({ cityCode: 'augsburg', language: 'de', path: null, type: 'local' })

    expect(navigation.navigate).toHaveBeenCalledWith(expect.objectContaining({
      key: expect.stringMatching(/^.{6,}$/) // at least 6 chars but no newline
    }))
    const key = (navigation.navigate: any).mock.calls[0][0].key
    expect(dispatch).toHaveBeenCalledWith({
      type: 'FETCH_NEWS',
      params: expect.objectContaining({ key })
    })
  })

  it('should have onRouteClose in navigation params', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    const navigateToNews = createNavigateToNews(dispatch, navigation)
    navigateToNews({ cityCode: 'augsburg', language: 'de', path: null, type: 'local' })

    expect(navigation.navigate).toHaveBeenCalledWith(expect.objectContaining({
      key: expect.any(String), // at least 6 chars but no newline
      params: expect.objectContaining({
        onRouteClose: expect.any(Function)
      })
    }))

    const key = (navigation.navigate: any).mock.calls[0][0].key
    const city = 'augsburg'
    // $FlowFixMe .mock is missing
    navigation.navigate.mock.calls[0][0].params.onRouteClose()
    expect(dispatch).toHaveBeenLastCalledWith({
      type: 'CLEAR_NEWS', params: { key, city }
    })
  })

  it('should dispatch a FETCH_NEWS action and refresh resources on force refresh', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    const navigateToNews = createNavigateToNews(dispatch, navigation)
    navigateToNews({
      cityCode: 'augsburg', type: 'local', language: 'de', path: '12', key: 'route-id-1', forceRefresh: true
    })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'FETCH_NEWS',
      params: {
        city: 'augsburg',
        language: 'de',
        path: '12',
        key: 'route-id-1',
        type: 'local',
        criterion: { forceUpdate: true, shouldRefreshResources: true }
      }
    })
  })
})
