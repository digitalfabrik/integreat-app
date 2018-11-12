// @flow

import { createAction } from 'redux-actions'
import { NOT_FOUND } from 'redux-first-router'
import type { Action } from 'redux-first-router'

export const goToNotFound = (): Action => createAction<string, void>(NOT_FOUND)()
