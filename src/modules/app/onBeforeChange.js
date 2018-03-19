// @flow

import type { Dispatch, GetState, Bag } from 'redux-first-router/dist/flow-types'
import { CATEGORIES_ROUTE } from './routes/categories'
import { removeCategories } from '../endpoint/actions/remover'
import { categoriesFetcher } from '../endpoint/fetchers'

/**
 * This handles the use of the back/ next button of the browser. We have to remove and refetch the categories in the old
 * language, because the stopover of CategoriesRedirect, during which the refetch normally happens, is not executed again
 * when using the back/ next button.
 * @param dispatch
 * @param getState
 * @param bag
 * @return {Promise<void>}
 */
const onBeforeChange = async (dispatch: Dispatch, getState: GetState, bag: Bag) => {
  const state = getState()
  const {city, language} = bag.action.payload
  const type = bag.action.type
  const prevLanguage = state.location.payload.language
  if (bag.action.meta) {
    const historyActionType = bag.action.meta.location.kind

    if (type === CATEGORIES_ROUTE && historyActionType === 'pop' && language !== prevLanguage) {
      dispatch(removeCategories())

      await categoriesFetcher(dispatch, {city, language})
    }
  }
}

export default onBeforeChange
