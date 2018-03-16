// @flow

import { createAction } from 'redux-actions'
import type { Dispatch, GetState } from 'redux-first-router/dist/flow-types'

// types of the atcions
export const CATEGORIES_REMOVED = 'CATEGORIES_REMOVED'
export const LANGUAGES_REMOVED = 'LANGUAGES_REMOVED'
export const EVENTS_REMOVED = 'EVENTS_REMOVED'
export const EXTRAS_REMOVED = 'EXTRAS_REMOVED'
export const DISCLAIMER_REMOVED = 'DISCLAIMER_REMOVED'
export const SPRUNGBRETT_JOBS_REMOVED = 'SPRUNGBRETT_JOBS_REMOVED'

// actions to remove data from the redux store
export const removeCategories = () => createAction(CATEGORIES_REMOVED)()
const removeLanguages = () => createAction(LANGUAGES_REMOVED)()
const removeEvents = () => createAction(EVENTS_REMOVED)()
const removeExtras = () => createAction(EXTRAS_REMOVED)()
const removeDisclaimer = () => createAction(DISCLAIMER_REMOVED)()
const removeSprungbrettJobs = () => createAction(SPRUNGBRETT_JOBS_REMOVED)()

export const clearStoreOnLanguageChange = (dispatch: Dispatch, getState: GetState) => {
  const state = getState()
  if (state.categories) {
    dispatch(removeCategories())
  }
  if (state.disclaimer) {
    dispatch(removeDisclaimer())
  }
  if (state.extras) {
    dispatch(removeExtras())
  }
  if (state.events) {
    dispatch(removeEvents())
  }
  if (state.sprungbrettJobs) {
    dispatch(removeSprungbrettJobs())
  }
}

export const clearStoreOnCityChange = (dispatch: Dispatch, getState: GetState) => {
  clearStoreOnLanguageChange(dispatch, getState)
  if (getState().languages) {
    dispatch(removeLanguages())
  }
}
