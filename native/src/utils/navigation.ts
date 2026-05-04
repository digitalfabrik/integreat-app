import {
  BOTTOM_TAB_ROUTE,
  CATEGORIES_ROUTE,
  CATEGORIES_TAB_ROUTE,
  EVENTS_ROUTE,
  EVENTS_TAB_ROUTE,
  NEWS_ROUTE,
  NEWS_TAB_ROUTE,
  POIS_ROUTE,
  POIS_TAB_ROUTE,
} from 'shared'

import { ROOT_NAVIGATOR_ID, TAB_NAVIGATOR_ID } from '../constants'
import {
  NavigationProps,
  NestedRoutesParamsType,
  NestedRoutesType,
  RoutesType,
  TabRoutesType,
} from '../constants/NavigationTypes'

const tabRoutes: Record<NestedRoutesType, TabRoutesType> = {
  [CATEGORIES_ROUTE]: CATEGORIES_TAB_ROUTE,
  [EVENTS_ROUTE]: EVENTS_TAB_ROUTE,
  [NEWS_ROUTE]: NEWS_TAB_ROUTE,
  [POIS_ROUTE]: POIS_TAB_ROUTE,
}

export const navigateNested = <T extends RoutesType, S extends keyof NestedRoutesParamsType>(
  navigation: NavigationProps<T>,
  route: S,
  params: NestedRoutesParamsType[S],
  redirect: boolean,
): void => {
  if (navigation.getId() === ROOT_NAVIGATOR_ID) {
    const bottomTabRouteOpened = navigation.getState().routes.some(({ name }) => name === BOTTOM_TAB_ROUTE)

    if (redirect) {
      // Allow going back to the dashboard if opening a deep link
      navigation.replace(BOTTOM_TAB_ROUTE, {
        screen: CATEGORIES_TAB_ROUTE,
        params: {
          screen: CATEGORIES_ROUTE,
        },
      })
    }

    const navigate = bottomTabRouteOpened && redirect ? navigation.replace : navigation.push
    navigate(BOTTOM_TAB_ROUTE, {
      screen: tabRoutes[route],
      params: {
        screen: route,
        params,
      },
    })
    return
  }

  const tabNavigationState = navigation.getParent(TAB_NAVIGATOR_ID)?.getState()
  const currentTab = tabNavigationState?.routes[tabNavigationState.index]?.name

  // No tab stack navigator yet, we need to navigate to the tab stack first
  if (navigation.getId() === TAB_NAVIGATOR_ID || currentTab !== tabRoutes[route]) {
    // @ts-expect-error Invalid parameters due to nesting
    navigation.getParent(TAB_NAVIGATOR_ID).navigate(tabRoutes[route], {
      screen: route,
      params,
    })
    return
  }

  const navigate = redirect ? navigation.replace : navigation.push
  // @ts-expect-error It is assured that params is not undefined
  navigate(route, params)
}
