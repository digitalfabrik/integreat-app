// @flow

import createNavigateToCategory from '../createNavigateToCategory'
import createNavigationScreenPropMock from '../../../testing/createNavigationStackPropMock'

describe('createNavigateToCategory', () => {
  it('should navigate to the specified route as in the supplied routeName', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    const navigateToCategory = createNavigateToCategory('Categories', dispatch, navigation)
    navigateToCategory({ cityCode: 'augsburg', language: 'de', path: '/augsburg/de/erste-hilfe' })
    expect(navigation.navigate).toHaveBeenCalledWith(expect.objectContaining({
      routeName: 'Categories'
    }))

    const navigateToDashboard = createNavigateToCategory('Dashboard', dispatch, navigation)
    navigateToDashboard({ cityCode: 'augsburg', language: 'de', path: '/augsburg/de' })
    expect(navigation.navigate).toHaveBeenCalledWith(expect.objectContaining({
      routeName: 'Dashboard'
    }))
  })

  it('should generate key if not supplied with at least 6 chars and use it for both navigation and redux actions', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    const navigateToCategory = createNavigateToCategory('Categories', dispatch, navigation)
    navigateToCategory({ cityCode: 'augsburg', language: 'de', path: '/augsburg/de/erste-hilfe' })

    expect(navigation.navigate).toHaveBeenCalledWith(expect.objectContaining({
      key: expect.stringMatching(/^.{6,}$/) // at least 6 chars but no newline
    }))
    const key = (navigation.navigate: any).mock.calls[0][0].key
    expect(dispatch).toHaveBeenCalledWith({
      type: 'FETCH_CATEGORY',
      params: expect.objectContaining({ key })
    })
  })

  it('should have onRouteClose in navigation params', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    const navigateToCategory = createNavigateToCategory('Categories', dispatch, navigation)
    navigateToCategory({ cityCode: 'augsburg', language: 'de', path: '/augsburg/de/erste-hilfe' })

    expect(navigation.navigate).toHaveBeenCalledWith(expect.objectContaining({
      key: expect.any(String), // at least 6 chars but no newline
      params: expect.objectContaining({
        onRouteClose: expect.any(Function)
      })
    }))

    const key = (navigation.navigate: any).mock.calls[0][0].key
    // $FlowFixMe .mock is missing
    navigation.navigate.mock.calls[0][0].params.onRouteClose()
    expect(dispatch).toHaveBeenLastCalledWith({
      type: 'CLEAR_CATEGORY', params: { key }
    })
  })

  it('should pass sharePath in navigation params', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    const navigateToCategory = createNavigateToCategory('Categories', dispatch, navigation)
    navigateToCategory({ cityCode: 'augsburg', language: 'de', path: '/augsburg/de/erste-hilfe' })

    expect(navigation.navigate).toHaveBeenCalledWith(expect.objectContaining({
      params: expect.objectContaining({ sharePath: '/augsburg/de/erste-hilfe' })
    }))
  })

  it('should dispatch a FETCH_CATEGORY action and refresh resources on force refresh', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    const navigateToCategory = createNavigateToCategory('Categories', dispatch, navigation)
    navigateToCategory({
      cityCode: 'augsburg', language: 'de', path: '/augsburg/de/schule', key: 'route-id-1', forceRefresh: true
    })

    expect(dispatch).toHaveBeenCalledWith({
      type: 'FETCH_CATEGORY',
      params: {
        city: 'augsburg',
        language: 'de',
        path: '/augsburg/de/schule',
        depth: 2,
        key: 'route-id-1',
        criterion: { forceUpdate: true, shouldRefreshResources: true }
      }
    })
  })
})
