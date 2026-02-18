import { BOTTOM_TAB_NAVIGATION_ROUTE } from 'shared'

import { RoutesType } from '../constants/NavigationTypes'

// Structure: Root stack -> BottomTabs -> Tab stack with [initial screen, target screen with params]
export const buildNestedAction = (
  routeName: RoutesType,
  params: Record<string, unknown>,
  bottomTabKey?: string,
): {
  index: number
  routes: {
    name: typeof BOTTOM_TAB_NAVIGATION_ROUTE
    key?: string
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
      // BottomTabs Root
      name: BOTTOM_TAB_NAVIGATION_ROUTE,
      // Preserve the existing tab navigator key to avoid remounting
      ...(bottomTabKey ? { key: bottomTabKey } : {}),
      state: {
        routes: [
          {
            // Active tab
            name: routeName,
            state: {
              // Tab's inner stack => target page with params
              // So the user lands on the target and pressing back returns to the tab root.
              routes: [{ name: routeName }, { name: routeName, params }],
              index: 1,
            },
          },
        ],
      },
    },
  ],
})
