import { BOTTOM_TAB_NAVIGATION_ROUTE } from 'shared'

import { RoutesType } from '../constants/NavigationTypes'

export const buildNestedAction = (
  routeName: RoutesType,
  params: Record<string, unknown>,
): {
  index: number
  routes: {
    name: typeof BOTTOM_TAB_NAVIGATION_ROUTE
    state: {
      routes: {
        name: RoutesType
        state: {
          routes: ({ name: RoutesType } | { name: RoutesType; params: Record<string, unknown> })[]
          index: number
        }
      }[]
    }
  }[]
} => ({
  index: 0,
  routes: [
    {
      name: BOTTOM_TAB_NAVIGATION_ROUTE,
      state: {
        routes: [
          {
            name: routeName,
            state: {
              routes: [{ name: routeName }, { name: routeName, params }],
              index: 1,
            },
          },
        ],
      },
    },
  ],
})
