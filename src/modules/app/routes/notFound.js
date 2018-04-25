// @flow

import { createAction } from 'redux-actions'
import { NOT_FOUND } from 'redux-first-router'
import type { Action } from 'redux-first-router/dist/flow-types'

export const goToNotFound = (): Action => createAction(NOT_FOUND)()
