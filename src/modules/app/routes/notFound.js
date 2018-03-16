// @flow

import { createAction } from 'redux-actions'
import { NOT_FOUND } from 'redux-first-router'

export const goToNotFound = (city: string, language: ?string) =>
  createAction(NOT_FOUND)(city, language)
