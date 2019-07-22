// @flow

import type { StateType } from '../../app/StateType'
import { type InputSelector } from 'reselect'

type SelectPropsType = { routeKey: string }
/**
 * This fetch corresponds to a peek if the major content language is not equal to the name of the current route.
 * In this case the fetching and header behaves different. It doesn't fetch resources for example.
 *
 * @param state The current state
 * @param params The params which contain the routeKey
 * @returns true if the fetch corresponds to a peek
 */
const isPeekRoute: InputSelector<StateType, SelectPropsType, boolean> = (
  state: StateType, { routeKey }: SelectPropsType
): boolean => {
  const cityContent = state.cityContent

  if (!cityContent) {
    // cityContent is only available when navigating within a city
    return false
  }

  const routeMapping = cityContent.categoriesRouteMapping
  const route = routeMapping[routeKey]

  if (!route) {
    // Route does not exist yet. In this case it is not really defined whether we are peeking or not because
    // we do not yet know the city of the route.
    return false
  }

  return cityContent.city !== route.city /* If switching the city we want to peek. If we are in the same city we should
                                            not peek */
}

export default isPeekRoute
