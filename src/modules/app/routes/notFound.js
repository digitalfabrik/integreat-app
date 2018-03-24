// @flow

import { createAction } from 'redux-actions'
import { NOT_FOUND } from 'redux-first-router'

export const goToNotFound = () => createAction(NOT_FOUND)()
