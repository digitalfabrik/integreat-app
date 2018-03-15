// @flow

import { handleAction, handleActions } from 'redux-actions'
import { CITIES_FETCHED } from '../fetchers/cities'
import { LANGUAGES_FETCHED } from '../fetchers/languages'
import { CATEGORIES_FETCHED } from '../fetchers/categories'
import { EVENTS_FETCHED } from '../fetchers/events'
import { EXTRAS_FETCHED } from '../fetchers/extras'
import { DISCLAIMER_FETCHED } from '../fetchers/disclaimer'
import { SPRUNGBRETT_JOBS_FETCHED } from '../fetchers/sprungbrettJobs'
import {
  CATEGORIES_REMOVED, DISCLAIMER_REMOVED, EVENTS_REMOVED, EXTRAS_REMOVED, LANGUAGES_REMOVED,
  SPRUNGBRETT_JOBS_REMOVED
} from '../remover'

import type { Action, Store } from 'redux-first-router/dist/flow-types'

const fetcherReducer = (state: Store, action: Action) => action.payload
const removerReducer = () => null

const defaultState = null

const reducers = {
  cities: handleAction(CITIES_FETCHED, fetcherReducer, defaultState),
  languages: handleActions({
    [LANGUAGES_FETCHED]: fetcherReducer,
    [LANGUAGES_REMOVED]: removerReducer
  },
  defaultState
  ),
  categories: handleActions({
    [CATEGORIES_FETCHED]: fetcherReducer,
    [CATEGORIES_REMOVED]: removerReducer
  },
  defaultState
  ),
  events: handleActions({
    [EVENTS_FETCHED]: fetcherReducer,
    [EVENTS_REMOVED]: removerReducer
  },
  defaultState
  ),
  extras: handleActions({
    [EXTRAS_FETCHED]: fetcherReducer,
    [EXTRAS_REMOVED]: removerReducer
  },
  defaultState
  ),
  disclaimer: handleActions({
    [DISCLAIMER_FETCHED]: fetcherReducer,
    [DISCLAIMER_REMOVED]: removerReducer
  },
  defaultState
  ),
  sprungbrettJobs: handleActions({
    [SPRUNGBRETT_JOBS_FETCHED]: fetcherReducer,
    [SPRUNGBRETT_JOBS_REMOVED]: removerReducer
  },
  defaultState
  )
}

export default reducers
