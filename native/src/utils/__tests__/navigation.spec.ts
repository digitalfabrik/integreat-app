import {
  BOTTOM_TAB_NAVIGATION_ROUTE,
  CATEGORIES_ROUTE,
  CATEGORIES_TAB_ROUTE,
  EVENTS_ROUTE,
  EVENTS_TAB_ROUTE,
  NEWS_ROUTE,
  NEWS_TAB_ROUTE,
  POIS_ROUTE,
  POIS_TAB_ROUTE,
} from 'shared'

import { ROOT_NAVIGATOR_ID, TAB_NAVIGATOR_ID } from '../../constants'
import createNavigationMock from '../../testing/createNavigationPropMock'
import { navigateNested } from '../navigation'

const buildNavigation = ({
  id,
  parentId,
  currentTabName,
  rootRouteNames,
}: {
  id: string
  parentId?: string
  currentTabName?: string
  rootRouteNames?: string[]
}) => {
  const tabState = currentTabName ? { routes: [{ name: currentTabName }], index: 0 } : undefined

  const parent = parentId
    ? {
        navigate: jest.fn(),
        getState: jest.fn().mockReturnValue(tabState),
      }
    : null

  const routes = rootRouteNames ? rootRouteNames.map(name => ({ name })) : [{ name: CATEGORIES_ROUTE }]

  const navigation = {
    ...createNavigationMock(),
    getId: jest.fn().mockReturnValue(id),
    push: jest.fn(),
    replace: jest.fn(),
    navigate: jest.fn(),
    getState: jest.fn().mockReturnValue({ routes }),
    getParent: jest.fn().mockImplementation((navigatorId: string) => (navigatorId === parentId ? parent : null)),
  }

  return { navigation, parent }
}

describe('navigateNested', () => {
  const categoriesParams = { path: '/augsburg/de/category' }
  const eventsParams = { slug: 'some-event' }
  const poisParams = { slug: 'some-poi' }
  const newsParams = { newsId: 1, newsType: 'local' as const }

  describe('root navigator', () => {
    it('pushes bottom tab route with correct tab and screen', () => {
      const { navigation } = buildNavigation({ id: ROOT_NAVIGATOR_ID })

      navigateNested(navigation, CATEGORIES_ROUTE, categoriesParams, false)

      expect(navigation.replace).not.toHaveBeenCalled()
      expect(navigation.push).toHaveBeenCalledTimes(1)
      expect(navigation.push).toHaveBeenCalledWith(BOTTOM_TAB_NAVIGATION_ROUTE, {
        screen: CATEGORIES_TAB_ROUTE,
        params: { screen: CATEGORIES_ROUTE, params: categoriesParams },
      })
    })

    it('allows going back when redirecting ', () => {
      const { navigation } = buildNavigation({ id: ROOT_NAVIGATOR_ID })

      navigateNested(navigation, EVENTS_ROUTE, eventsParams, true)

      expect(navigation.replace).toHaveBeenCalledTimes(1)
      expect(navigation.replace).toHaveBeenCalledWith(BOTTOM_TAB_NAVIGATION_ROUTE, {
        screen: CATEGORIES_TAB_ROUTE,
        params: { screen: CATEGORIES_ROUTE },
      })
      expect(navigation.push).toHaveBeenCalledTimes(1)
      expect(navigation.push).toHaveBeenCalledWith(BOTTOM_TAB_NAVIGATION_ROUTE, {
        screen: EVENTS_TAB_ROUTE,
        params: { screen: EVENTS_ROUTE, params: eventsParams },
      })
    })

    it('replaces the bottom tab route when it is already open and redirecting', () => {
      const { navigation } = buildNavigation({
        id: ROOT_NAVIGATOR_ID,
        rootRouteNames: [BOTTOM_TAB_NAVIGATION_ROUTE],
      })

      navigateNested(navigation, EVENTS_ROUTE, eventsParams, true)

      expect(navigation.replace).toHaveBeenCalledTimes(2)
      expect(navigation.replace).toHaveBeenNthCalledWith(1, BOTTOM_TAB_NAVIGATION_ROUTE, {
        screen: CATEGORIES_TAB_ROUTE,
        params: { screen: CATEGORIES_ROUTE },
      })
      expect(navigation.replace).toHaveBeenNthCalledWith(2, BOTTOM_TAB_NAVIGATION_ROUTE, {
        screen: EVENTS_TAB_ROUTE,
        params: { screen: EVENTS_ROUTE, params: eventsParams },
      })
      expect(navigation.push).not.toHaveBeenCalled()
    })

    it('maps each nested route to its correct tab route', () => {
      const cases = [
        { route: CATEGORIES_ROUTE, tabRoute: CATEGORIES_TAB_ROUTE, params: categoriesParams },
        { route: EVENTS_ROUTE, tabRoute: EVENTS_TAB_ROUTE, params: eventsParams },
        { route: POIS_ROUTE, tabRoute: POIS_TAB_ROUTE, params: poisParams },
        { route: NEWS_ROUTE, tabRoute: NEWS_TAB_ROUTE, params: newsParams },
      ] as const

      cases.forEach(({ route, tabRoute, params }) => {
        const { navigation } = buildNavigation({ id: ROOT_NAVIGATOR_ID })
        navigateNested(navigation, route, params, false)
        expect(navigation.push).toHaveBeenCalledWith(BOTTOM_TAB_NAVIGATION_ROUTE, {
          screen: tabRoute,
          params: { screen: route, params },
        })
      })
    })
  })

  describe('tab navigator', () => {
    it('navigates via tab parent to the target tab and screen', () => {
      const { navigation, parent } = buildNavigation({
        id: TAB_NAVIGATOR_ID,
        parentId: TAB_NAVIGATOR_ID,
        currentTabName: EVENTS_TAB_ROUTE,
      })

      navigateNested(navigation, CATEGORIES_ROUTE, categoriesParams, false)

      expect(navigation.push).not.toHaveBeenCalled()
      expect(navigation.replace).not.toHaveBeenCalled()
      expect(parent!.navigate).toHaveBeenCalledWith(CATEGORIES_TAB_ROUTE, {
        screen: CATEGORIES_ROUTE,
        params: categoriesParams,
      })
    })

    it('navigates to correct tab when redirecting from tab navigator', () => {
      const { navigation, parent } = buildNavigation({
        id: TAB_NAVIGATOR_ID,
        parentId: TAB_NAVIGATOR_ID,
        currentTabName: CATEGORIES_TAB_ROUTE,
      })

      navigateNested(navigation, POIS_ROUTE, poisParams, true)

      expect(parent!.navigate).toHaveBeenCalledWith(POIS_TAB_ROUTE, {
        screen: POIS_ROUTE,
        params: poisParams,
      })
    })
  })

  describe('stack navigator', () => {
    it('navigates via tab parent when the current tab differs from the target tab', () => {
      const { navigation, parent } = buildNavigation({
        id: 'someStackNavigator',
        parentId: TAB_NAVIGATOR_ID,
        currentTabName: EVENTS_TAB_ROUTE, // currently on events tab
      })

      navigateNested(navigation, CATEGORIES_ROUTE, categoriesParams, false)

      expect(navigation.push).not.toHaveBeenCalled()
      expect(navigation.replace).not.toHaveBeenCalled()
      expect(parent!.navigate).toHaveBeenCalledWith(CATEGORIES_TAB_ROUTE, {
        screen: CATEGORIES_ROUTE,
        params: categoriesParams,
      })
    })
  })

  describe('from a nested stack within the same tab', () => {
    it('pushes directly onto the current stack when not redirecting', () => {
      const { navigation } = buildNavigation({
        id: 'someStackNavigator',
        parentId: TAB_NAVIGATOR_ID,
        currentTabName: CATEGORIES_TAB_ROUTE, // already on categories tab
      })

      navigateNested(navigation, CATEGORIES_ROUTE, categoriesParams, false)

      expect(navigation.push).toHaveBeenCalledWith(CATEGORIES_ROUTE, categoriesParams)
    })

    it('replaces directly onto the current stack when redirecting', () => {
      const { navigation } = buildNavigation({
        id: 'someStackNavigator',
        parentId: TAB_NAVIGATOR_ID,
        currentTabName: EVENTS_TAB_ROUTE, // already on events tab
      })

      navigateNested(navigation, EVENTS_ROUTE, eventsParams, true)

      expect(navigation.replace).toHaveBeenCalledWith(EVENTS_ROUTE, eventsParams)
      expect(navigation.push).not.toHaveBeenCalled()
    })
  })
})
