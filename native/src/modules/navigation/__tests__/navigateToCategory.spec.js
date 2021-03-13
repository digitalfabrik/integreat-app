// @flow

import navigateToCategory from '../navigateToCategory'
import createNavigationScreenPropMock from '../../../testing/createNavigationPropMock'
import { CATEGORIES_ROUTE, DASHBOARD_ROUTE } from 'api-client/src/routes'

jest.mock('../url', () => ({
  url: jest.fn(path => path)
}))

describe('navigateToCategory', () => {
  it('should navigate to the specified route as in the supplied route name', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    navigateToCategory({
      dispatch,
      navigation,
      routeName: CATEGORIES_ROUTE,
      cityCode: 'augsburg',
      languageCode: 'de',
      cityContentPath: '/augsburg/de/erste-hilfe'
    })
    expect(navigation.navigate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: CATEGORIES_ROUTE
      })
    )

    navigateToCategory({
      dispatch,
      navigation,
      routeName: DASHBOARD_ROUTE,
      cityCode: 'augsburg',
      languageCode: 'de',
      cityContentPath: '/augsburg/de'
    })
    expect(navigation.navigate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: DASHBOARD_ROUTE
      })
    )
  })

  it('should reset the navigation to the specified route if resetNavigation was set', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    navigateToCategory({
      dispatch,
      navigation,
      routeName: CATEGORIES_ROUTE,
      cityCode: 'augsburg',
      languageCode: 'de',
      cityContentPath: '/augsburg/de/erste-hilfe',
      resetNavigation: true
    })
    expect(navigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [expect.objectContaining({ name: CATEGORIES_ROUTE }) ]
    })

    navigateToCategory({
      dispatch,
      navigation,
      routeName: DASHBOARD_ROUTE,
      cityCode: 'augsburg',
      languageCode: 'de',
      cityContentPath: '/augsburg/de',
      resetNavigation: true
    })
    expect(navigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [expect.objectContaining({ name: DASHBOARD_ROUTE }) ]
    })
  })

  it('should generate key if not supplied with at least 6 chars and use it for both navigation and redux actions', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    navigateToCategory({
      dispatch,
      navigation,
      routeName: CATEGORIES_ROUTE,
      cityCode: 'augsburg',
      languageCode: 'de',
      cityContentPath: '/augsburg/de/erste-hilfe'
    })

    expect(navigation.navigate).toHaveBeenCalledWith(
      expect.objectContaining({
        key: expect.stringMatching(/^.{6,}$/) // at least 6 chars but no newline
      })
    )
    const key = (navigation.navigate: any).mock.calls[0][0].key
    expect(dispatch).toHaveBeenCalledWith({
      type: 'FETCH_CATEGORY',
      params: expect.objectContaining({ key })
    })
  })

  it('should dispatch a FETCH_CATEGORY action and refresh resources on force refresh', () => {
    const dispatch = jest.fn()
    const navigation = createNavigationScreenPropMock()

    navigateToCategory({
      dispatch,
      navigation,
      routeName: CATEGORIES_ROUTE,
      cityCode: 'augsburg',
      languageCode: 'de',
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
