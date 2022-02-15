import { escapeRegExp } from 'lodash'

import NotFoundError from '../NotFoundError'

describe('NotFoundError', () => {
  it('should have correct message', () => {
    const error = new NotFoundError({
      type: 'category',
      id: '/augsburg/de/test',
      city: 'augsburg',
      language: 'language'
    })
    expect(error.message).toBe('The category /augsburg/de/test does not exist here.')
  })
  it('should produce a stacktrace', () => {
    const error = new NotFoundError({
      type: 'category',
      id: '/augsburg/de/test',
      city: 'augsburg',
      language: 'language'
    })
    // Matches the first line in stack
    expect((error as Error).stack).toMatch(new RegExp(`${escapeRegExp(__filename)}:\\d+:\\d+`))
  })
})
