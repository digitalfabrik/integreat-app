import { createAction } from 'redux-actions'
import { NOT_FOUND } from 'redux-first-router'

export const goToNotFound = (obj: {type: string, notFound: string, city: ?string}) =>
  createAction(NOT_FOUND)(obj)
