// @flow

import type { Dispatch, GetState, Bag } from 'redux-first-router/dist/flow-types'
import { CATEGORIES_ROUTE } from './routes/categories'
import citiesFetcher from '../endpoint/endpoints/cities'
import languagesFetcher from '../endpoint/endpoints/languages'
import eventsFetcher from '../endpoint/endpoints/events'

import { EVENTS_ROUTE } from './routes/events'
import { EXTRAS_ROUTE } from './routes/extras'
import { DISCLAIMER_ROUTE } from './routes/disclaimer'
import { SEARCH_ROUTE } from './routes/search'

/**
 * This handles the use of the back/ next button of the browser. We have to remove and refetch the categories in the old
 * language, because the stopover of CategoriesRedirect, during which the refetch normally happens, is not executed again
 * when using the back/ next button.
 * @param dispatch
 * @param getState
 * @param bag
 */
const onBeforeChange = async (dispatch: Dispatch, getState: GetState, bag: Bag) => {
  const state = getState()
  const {city, language} = bag.action.payload
  const route = bag.action.type
  const params = {city, language}

  // in the following routes we have a location layout, so we need cities, languages and events
  if ([CATEGORIES_ROUTE, EVENTS_ROUTE, EXTRAS_ROUTE, DISCLAIMER_ROUTE, SEARCH_ROUTE].includes(route)) {
    await citiesFetcher.loadData(dispatch, state.cities, params)

    await languagesFetcher.loadData(dispatch, state.languages, params)

    await eventsFetcher.loadData(dispatch, state.events, params)
  }
}

export default onBeforeChange
