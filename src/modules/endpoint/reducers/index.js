import { handleAction } from 'redux-actions'

const reducer = (state, action) => action.payload
const defaultState = {}

const reducers = {
  locationModels: handleAction('LOCATIONS_FETCHED', reducer, defaultState),
  languages: handleAction('LANGUAGES_FETCHED', reducer, defaultState),
  categories: handleAction('CATEGORIES_FETCHED', reducer, defaultState),
  events: handleAction('EVENTS_FETCHED', reducer, defaultState),
  extras: handleAction('EXTRAS_FETCHED', reducer, defaultState),
  disclaimer: handleAction('DISCLAIMER_FETCHED', reducer, defaultState),
  sprungbrett: handleAction('SPRUNGBRETT_FETCHED', reducer, defaultState)
}

export default reducers
