// @flow

import { createAction } from 'redux-actions'
import type { Payload } from 'redux-first-router/dist/flow-types'

export const CATEGORIES_FETCHED = 'CATEGORIES_FETCHED'
export const SPRUNGBRETT_JOBS_FETCHED = 'SPRUNGBRETT_JOBS_FETCHED'
export const LANGUAGES_FETCHED = 'LANGUAGES_FETCHED'
export const EXTRAS_FETCHED = 'EXTRAS_FETCHED'
export const EVENTS_FETCHED = 'EVENTS_FETCHED'
export const DISCLAIMER_FETCHED = 'DISCLAIMER_FETCHED'
export const CITIES_FETCHED = 'CITIES_FETCHED'

export const saveCategories = (payload: Payload) => createAction(CATEGORIES_FETCHED)(payload)
export const saveSprungbrettJobs = (payload: Payload) => createAction(SPRUNGBRETT_JOBS_FETCHED)(payload)
export const saveCities = (payload: Payload) => createAction(CITIES_FETCHED)(payload)
export const saveLanguages = (payload: Payload) => createAction(LANGUAGES_FETCHED)(payload)
export const saveDisclaimer = (payload: Payload) => createAction(DISCLAIMER_FETCHED)(payload)
export const saveEvents = (payload: Payload) => createAction(EVENTS_FETCHED)(payload)
export const saveExtras = (payload: Payload) => createAction(EXTRAS_FETCHED)(payload)
