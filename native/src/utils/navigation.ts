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

import { RoutesType } from '../constants/NavigationTypes'

const toTabRoute: Partial<Record<string, string>> = {
  [CATEGORIES_ROUTE]: CATEGORIES_TAB_ROUTE,
  [EVENTS_ROUTE]: EVENTS_TAB_ROUTE,
  [NEWS_ROUTE]: NEWS_TAB_ROUTE,
  [POIS_ROUTE]: POIS_TAB_ROUTE,
}

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
        key: string
        state: {
          routes: ({ name: RoutesType } | { name: RoutesType; params: Record<string, unknown> })[]
          index: number
        }
      }[]
      index: number
      history: { type: string; key: string }[]
    }
  }[]
} => {
  const tabRoute = (toTabRoute[routeName] ?? routeName) as RoutesType

  return {
    index: 0,
    routes: [
      {
        // BottomTabs Root
        name: BOTTOM_TAB_NAVIGATION_ROUTE,
        // Preserve the existing tab navigator key to avoid remounting
        ...(bottomTabKey ? { key: bottomTabKey } : {}),
        state: {
          routes: [
            // Always include Categories so back navigation returns to it
            ...(routeName !== CATEGORIES_ROUTE
              ? [
                  {
                    name: CATEGORIES_TAB_ROUTE,
                    key: CATEGORIES_TAB_ROUTE,
                    state: { routes: [{ name: CATEGORIES_ROUTE }], index: 0 },
                  },
                ]
              : []),
            {
              // Active tab
              name: tabRoute,
              key: tabRoute,
              state: {
                // Tab's inner stack => target page with params
                // So the user lands on the target and pressing back returns to the tab root.
                routes: [{ name: routeName }, { name: routeName, params }],
                index: 1,
              },
            },
          ],
          index: routeName !== CATEGORIES_ROUTE ? 1 : 0,

          // Place Categories first so pressing back returns there, unless already on it to avoid duplicates.
          history:
            routeName !== CATEGORIES_ROUTE
              ? [
                  { type: 'route', key: CATEGORIES_TAB_ROUTE },
                  { type: 'route', key: tabRoute },
                ]
              : [{ type: 'route', key: tabRoute }],
        },
      },
    ],
  }
}
