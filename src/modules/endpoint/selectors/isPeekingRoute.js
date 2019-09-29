// @flow

import type { StateType } from '../../app/StateType'
import { type InputSelector } from 'reselect'

type SelectPropsType = {routeCity: string}

/**
 * This fetch corresponds to a peek if the major content city is not equal to the city of the current route.
 * In this case the fetching and header behaves different. It doesn't fetch resources for example.
 *
 * @param state The current state
 * @param params The params which contain the routeCity
 * @returns true if the fetch corresponds to a peek
 */
const isPeekingRoute: InputSelector<StateType, SelectPropsType, boolean> = (
  state: StateType, { routeCity }: SelectPropsType
): boolean => {
  const cityContent = state.cityContent

  if (!cityContent) {
    // cityContent is only available when navigating within a city
    return false
  }

  return cityContent.city !== routeCity /* If we're the city differs to the selected city, we want to peek.
                                           If we are in the same city we should not peek. */
}

export default isPeekingRoute
