// @flow

import { createAction } from 'redux-actions'
import { NOT_FOUND } from 'redux-first-router'

export const getNotFoundPath = (): string => NOT_FOUND

export const goToNotFound = () => createAction<string, void>(NOT_FOUND)()
