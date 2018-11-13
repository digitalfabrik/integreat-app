// @flow

import { getNotFoundPath } from '../notFound'
import { NOT_FOUND } from 'redux-first-router'

describe('notFound route', () => {
  it('should create the right path', () => {
    expect(getNotFoundPath()).toBe(NOT_FOUND)
  })
})
