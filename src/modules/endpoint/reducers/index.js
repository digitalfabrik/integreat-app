// @flow

import { handleAction, handleActions } from 'redux-actions'
import {
  CITIES_FETCHED, LANGUAGES_FETCHED, EXTRAS_FETCHED, EVENTS_FETCHED, DISCLAIMER_FETCHED, SPRUNGBRETT_JOBS_FETCHED,
  CATEGORIES_FETCHED
} from '../actions/fetcher'

import {
  CATEGORIES_REMOVED, DISCLAIMER_REMOVED, EVENTS_REMOVED, EXTRAS_REMOVED, LANGUAGES_REMOVED,
  SPRUNGBRETT_JOBS_REMOVED
} from '../actions/remover'

import type { Action, Store } from 'redux-first-router/dist/flow-types'
import Payload from '../Payload'

const fetcherReducer = (state: Store, action: Action) => action.payload
const removerReducer = () => null

const defaultState = new Payload(false)

// reducers to handle the fetching and removing of data to and from the redux store
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
