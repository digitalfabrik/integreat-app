import { goToNotFound } from '../notFound'
import { NOT_FOUND } from 'redux-first-router'

describe('notFound route', () => {
  it('should create the right action', () => {
    expect(goToNotFound()).toEqual({
      type: NOT_FOUND
    })
  })
})
