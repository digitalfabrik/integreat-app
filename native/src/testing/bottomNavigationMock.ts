import { StackNavigationState } from '@react-navigation/native'

import { BOTTOM_TAB_NAVIGATION_ROUTE } from 'shared'

import { RoutesParamsType, RoutesType } from '../constants/NavigationTypes'

export const createBottomTabNavigationState = ({
  activeTab,
}: {
  activeTab: RoutesType
}): StackNavigationState<RoutesParamsType> => ({
  index: 0,
  routes: [
    {
      key: 'bottom-tabs-key',
      name: BOTTOM_TAB_NAVIGATION_ROUTE,
      state: {
        index: 0,
        routes: [
          {
            key: 'active-tab-route-key',
            name: activeTab,
            state: {
              key: 'active-tab-stack-key',
              index: 0,
              routes: [{ name: activeTab, key: 'active-tab-key' }],
              routeNames: [activeTab],
              type: 'stack',
              stale: false,
            },
          },
        ],
        key: 'bottom-tabs-state-key',
        routeNames: [activeTab],
        type: 'tab',
        stale: false,
      },
    },
  ],
  key: 'root-key',
  routeNames: [BOTTOM_TAB_NAVIGATION_ROUTE],
  type: 'stack',
  stale: false,
  preloadedRoutes: [],
})
