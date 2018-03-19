// @flow

import type { Dispatch, GetState, Bag } from 'redux-first-router/dist/flow-types'
import { CATEGORIES_ROUTE } from './routes/categories'
import { clearStoreOnCityChange, clearStoreOnLanguageChange } from '../endpoint/actions/remover'
import { citiesFetcher, eventsFetcher, languagesFetcher } from '../endpoint/fetchers'
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
  const prevCity = state.location.payload.city
  const prevLanguage = state.location.payload.language
  const params = {city, language}

  if (prevLanguage && prevLanguage !== language) {
    clearStoreOnLanguageChange(dispatch, getState)
  }

  if (prevCity && prevCity !== city) {
    clearStoreOnCityChange(dispatch, getState)
  }

  if ([CATEGORIES_ROUTE, EVENTS_ROUTE, EXTRAS_ROUTE, DISCLAIMER_ROUTE, SEARCH_ROUTE].includes(route)) {
    if (!state.cities) {
      await citiesFetcher(dispatch, params)
    }

    if (!state.languages) {
      await languagesFetcher(dispatch, params)
    }

    if (!state.events) {
      await eventsFetcher(dispatch, params)
    }
  }
}

export default onBeforeChange
