// @flow

import createNavigateToCategory from '../createNavigateToCategory'
import createNavigationScreenPropMock from '../../../testing/createNavigationPropMock'
import { CATEGORIES_ROUTE, DASHBOARD_ROUTE } from '../constants/NavigationTypes'

jest.mock('../../common/url', () => ({
  url: jest.fn(path => path)
}))

describe('createNavigateToCategory', () => {
  it('should navigate to the specified route as in the supplied route name', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    const navigateToCategory = createNavigateToCategory(CATEGORIES_ROUTE, dispatch, navigation)
    navigateToCategory({ cityCode: 'augsburg', language: 'de', cityContentPath: '/augsburg/de/erste-hilfe' })
    expect(navigation.navigate).toHaveBeenCalledWith(expect.objectContaining({
      name: CATEGORIES_ROUTE
    }))

    const navigateToDashboard = createNavigateToCategory(DASHBOARD_ROUTE, dispatch, navigation)
    navigateToDashboard({ cityCode: 'augsburg', language: 'de', cityContentPath: '/augsburg/de' })
    expect(navigation.navigate).toHaveBeenCalledWith(expect.objectContaining({
      name: DASHBOARD_ROUTE
    }))
  })

  it('should generate key if not supplied with at least 6 chars and use it for both navigation and redux actions', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    const navigateToCategory = createNavigateToCategory(CATEGORIES_ROUTE, dispatch, navigation)
    navigateToCategory({ cityCode: 'augsburg', language: 'de', cityContentPath: '/augsburg/de/erste-hilfe' })

    expect(navigation.navigate).toHaveBeenCalledWith(expect.objectContaining({
      key: expect.stringMatching(/^.{6,}$/) // at least 6 chars but no newline
    }))
    const key = (navigation.navigate: any).mock.calls[0][0].key
    expect(dispatch).toHaveBeenCalledWith({
      type: 'FETCH_CATEGORY',
      params: expect.objectContaining({ key })
    })
  })

  it('should pass share url in navigation params', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    const navigateToCategory = createNavigateToCategory(CATEGORIES_ROUTE, dispatch, navigation)
    navigateToCategory({ cityCode: 'augsburg', language: 'de', cityContentPath: '/augsburg/de/erste-hilfe' })

    expect(navigation.navigate).toHaveBeenCalledWith(expect.objectContaining({
      params: expect.objectContaining({ shareUrl: '/augsburg/de/erste-hilfe' })
    }))
  })

  it('should dispatch a FETCH_CATEGORY action and refresh resources on force refresh', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    const navigateToCategory = createNavigateToCategory(CATEGORIES_ROUTE, dispatch, navigation)
    navigateToCategory({
      cityCode: 'augsburg',
      language: 'de',
      cityContentPath: '/augsburg/de/schule',
      key: 'route-id-1',
      forceRefresh: true
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
